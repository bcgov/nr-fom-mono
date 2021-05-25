import { ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getManager, Repository } from 'typeorm';
import { GeoJsonProperties, Geometry, LineString, Polygon, Position } from 'geojson';
import * as dayjs from 'dayjs';
import * as customParseFormat  from 'dayjs/plugin/customParseFormat';
import { PinoLogger } from 'nestjs-pino';

import { Submission } from './submission.entity';
import { FomSpatialJson, SpatialObjectCodeEnum, SubmissionRequest } from './submission.dto';
import { ProjectService } from '../project/project.service';
import { SubmissionTypeCodeEnum } from './submission-type-code.entity';
import { WorkflowStateCode } from '../workflow-state-code/entities/workflow-state-code.entity';
import { CutBlock } from './cut-block.entity';
import { RoadSection } from './road-section.entity';
import { RetentionArea } from './retention-area.entity';
import { ProjectDto } from '../project/dto/project.dto';
import { flatDeep } from '../../../core/utils';
import { User } from 'apps/api/src/core/security/user';

type SpatialObject = CutBlock | RoadSection | RetentionArea;

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private repository: Repository<Submission>,
    private logger: PinoLogger,
    private projectService: ProjectService,
  ) {
    dayjs.extend(customParseFormat);
  }

  isCreateAuthorized(user: User, dto: Partial<SubmissionRequest>): boolean {
    if (!user || !user.isForestClient) {
      return false;
    }
    // TODO: Confirm that forest client is authorized for this project based on project's client id.
    //     const project: ProjectDto = await this.projectService.findOne(dto.projectId, user);

    // return user.clientIds.includes(project.forest_client_number));
    return true;
  }
  
  isUpdateAuthorized(user: User, dto: any, entity: Partial<Submission>): boolean {
    return this.isCreateAuthorized(user, dto);
  }

  isDeleteAuthorized(user: User, id: number): boolean {
    // Submissions cannot be deleted.
    return false;
  }

  isViewingAuthorized(user: User): boolean {
    return true;
  }

  /**
   * Create or replace a spatial submission.
   */
  async processSpatialSubmission(dto: Partial<SubmissionRequest>, user: User): Promise<void> {       
    this.logger.debug(`${this.constructor.name}.create props %o`, dto);

    if (!this.isCreateAuthorized(user, dto)) {
      throw new ForbiddenException();
    }

    // Load the existing project to obtain the project's workflow state
    const project: ProjectDto = await this.projectService.findOne(dto.projectId, user);
    const workflowStateCode = project.workflowStateCode;
    const submissionTypeCode = this.getPermittedSubmissionTypeCode(workflowStateCode);

    // Confirm that the dto.submissionTypeCode equals what we expect. If not, return an error. 
    // @see {getPermittedSubmissoinStatus} comment.
    if (!submissionTypeCode || submissionTypeCode !== dto.submissionTypeCode) {
      const errMsg = `Submission (${dto.submissionTypeCode}) is not allowed for workflow_state_code ${workflowStateCode}.`;
      this.logger.error(errMsg);
      throw new UnprocessableEntityException(errMsg);
    }

    // Obtain Submission(or new one) so we have the id.
    const submission = await this.obtainExistingOrNewSubmission(dto.projectId, submissionTypeCode, user);

    const spatialObjects: SpatialObject[] = await this.prepareFomSpatialObjects(submission.id, dto.spatialObjectCode, dto.jsonSpatialSubmission, user);

    // And save the geospatial objects (will update/replace previous ones)
    if (SpatialObjectCodeEnum.CUT_BLOCK === dto.spatialObjectCode) {
      submission.cutBlocks = <CutBlock[]>spatialObjects;
    }
    else if (SpatialObjectCodeEnum.ROAD_SECTION === dto.spatialObjectCode) {
      submission.roadSections = <RoadSection[]>spatialObjects;
    }
    else {
      submission.retentionAreas = <RetentionArea[]>spatialObjects;
    }

    const updatedSubmission = await this.repository.save(submission);

    await this.updateGeospatialAreaOrLength(dto.spatialObjectCode, updatedSubmission.id, spatialObjects);

    await this.updateProjectLocation(project.id, user);
  }

  /**
   * Get the permitted submission_type_code based on the FOM workflow_state_code.
   * The submission type that is allowed to be done depends on the workflow state:
   *   INITIAL = PROPOSED
   *   COMMENTING_OPEN = none (no submission can be done)
   *   COMMENTING_CLOSED = FINAL
   *   FINALIZED/EXPIRED = none (return an error)
   * @param workFlowStateCode workflow_state_code that the FOM currently is having
   */
  getPermittedSubmissionTypeCode(workFlowStateCode: string): SubmissionTypeCodeEnum {
    let submissionTypeCode: SubmissionTypeCodeEnum;
    switch (workFlowStateCode) {
      case WorkflowStateCode.CODES.INITIAL:
        submissionTypeCode = SubmissionTypeCodeEnum.PROPOSED;
        break;

      case WorkflowStateCode.CODES.COMMENT_CLOSED:
        submissionTypeCode = SubmissionTypeCodeEnum.FINAL;
        break;
      
      default:
        submissionTypeCode = null;
    }
    return submissionTypeCode;
  }

  /**
   * Return existing Submisson for the Submission type if found or create new one (saved new record).
   * @param projectId submission.project_id
   * @param submissionTypeCode @see {SubmissionTypeCodeEnum}
   * @returns existing or new Submission for that submissionTypeCode
   */
  async obtainExistingOrNewSubmission(projectId: number, submissionTypeCode: SubmissionTypeCodeEnum, user: User): Promise<Submission>  {
    // Obtain existing submission for the submission type
    const existingSubmissions: Submission[] = await this.repository.find({
      where: { projectId: projectId, submissionTypeCode: submissionTypeCode },
      relations: ['cutBlocks', 'retentionAreas', 'roadSections'],
    });
    this.logger.info('# existing submissions ' + existingSubmissions.length);

    var submission: Submission;
    if (existingSubmissions.length == 0) {
      // Save the submission first in order to populate primary key.
      // Populate fields
      submission = new Submission({             
        projectId: projectId,
        submissionTypeCode: submissionTypeCode,
        createUser: user.userName,
      })
      submission = await this.repository.save(submission);

    } else {
      submission = existingSubmissions[0];
      submission.updateUser = user.userName;
      submission.updateTimestamp = dayjs().toDate();
      submission.revisionCount += 1;
    }

    this.logger.debug('Obtained submission: %o', submission);
    return submission;
  }

  /**
   * // Validate that the dto.jsonSpatialSubmission is valid.
   * // Validate required field exists in 'properties'.
   * // Validate shape is correct? (TODO: do we need to validate this or assume user know what he is submitting?)
   * // Parse into cut_block, road_section, or WTRA objects based on dto.spatialObjectCode
   * 
   * @param spatialObjectCode 
   * @param jsonSpatialSubmission 
   * @returns spatial objects into cut_block, road_section, or WTRA objects based on dto.spatialObjectCode.
   */
  validateFomSpatialSubmission(spatialObjectCode: SpatialObjectCodeEnum, jsonSpatialSubmission: FomSpatialJson, user: User): 
    SpatialObject[] {

    // spatial objects holder to be parsed into.
    let spatialObjs: SpatialObject[];
    const features = jsonSpatialSubmission.features;
    const REQUIRED_PROP_DEVELOPMENT_DATE = 'DEVELOPMENT_DATE';
    const OPTIONAL_PROP_NAME = "NAME";
    const DATE_FORMAT = "YYYY-MM-DD";

    // validation - Validate each point(Position) is within BC bounding box.
    // BC bounding box: 1665146.77055,1725046.3621 to 33240.8114887,445948.165738.
    const validateCoordWithinBounding = (geometry: Geometry) => {
      const bb = {ix: 33240.8114887, iy: 445948.165738, ax: 1665146.77055, ay: 1725046.3621};
      const coordinates = (<Polygon | LineString> geometry).coordinates;
      flatDeep(coordinates).forEach( (p: Position) => {
        if( !(bb.ix <= p[0] && p[0] <= bb.ax && bb.iy <= p[1] && p[1] <= bb.ay) ) {
          const errMsg = `Coordinate (${p}) is not within BC bounding box ${JSON.stringify(bb)}.`;
          throw new UnprocessableEntityException(errMsg);
        }
      });
    };

    // validation - development_date
    const validateDevelopmentDate = (properties: GeoJsonProperties) => {
      if (spatialObjectCode === SpatialObjectCodeEnum.CUT_BLOCK || 
          spatialObjectCode === SpatialObjectCodeEnum.ROAD_SECTION) {
        if (!properties.hasOwnProperty(REQUIRED_PROP_DEVELOPMENT_DATE)) {
          const errMsg = `Required property ${REQUIRED_PROP_DEVELOPMENT_DATE} missing for ${spatialObjectCode}`;
          throw new UnprocessableEntityException(errMsg);
        }
        else {
          // validate date format: YYYY-MM-DD
          const developmentDate = properties[REQUIRED_PROP_DEVELOPMENT_DATE];
          if (!dayjs(developmentDate, DATE_FORMAT).isValid()) {
            const errMsg = `Required property ${REQUIRED_PROP_DEVELOPMENT_DATE} has wrong date format. Valid format: '${DATE_FORMAT}'`;
            throw new UnprocessableEntityException(errMsg);
          }
        }
      }
    };

    spatialObjs = features.map(f => {
      const geometry = f.geometry;
      const properties = f.properties;
      let name: string;
      if (properties.hasOwnProperty(OPTIONAL_PROP_NAME)) {
        name = properties[OPTIONAL_PROP_NAME];
      }

      validateCoordWithinBounding(geometry);

      if (spatialObjectCode === SpatialObjectCodeEnum.CUT_BLOCK) {
        // validate required properties.
        validateDevelopmentDate(properties);
        return new CutBlock({name, geometry,
          createUser: user.userName,
          plannedDevelopmentDate: properties[REQUIRED_PROP_DEVELOPMENT_DATE]});
      }
      else if (spatialObjectCode === SpatialObjectCodeEnum.ROAD_SECTION) {
        // validate required properties.
        validateDevelopmentDate(properties);
        return new RoadSection({name, geometry,
          createUser: user.userName,
          plannedDevelopmentDate: properties[REQUIRED_PROP_DEVELOPMENT_DATE]});
      }
      else {
        return new RetentionArea({geometry, createUser: user.userName});
      }
    });

    return spatialObjs;
  }

  /** 
   * @param spatialObjectCode 
   * @param jsonSpatialSubmission 
   * @returns Create the new geospatial objects parsed from the dto.jsonSpatialSubmission as children of the submission.
   */
  async prepareFomSpatialObjects(submissionId: number, spatialObjectCode: SpatialObjectCodeEnum, jsonSpatialSubmission: FomSpatialJson, user: User) 
    :Promise<SpatialObject[]> {
    this.logger.info(`Method prepareFomSpatialObjects called with spatialObjectCode:${spatialObjectCode}
        and jsonSpatialSubmission ${JSON.stringify(jsonSpatialSubmission)}`);

    const spatialObjs = this.validateFomSpatialSubmission(spatialObjectCode, jsonSpatialSubmission, user);
    spatialObjs.forEach((s) => {s.submissionId = submissionId}); // assign them to the submission 

    this.logger.info(`FOM spatial objects prepared: ${JSON.stringify(spatialObjs)}`);
    return spatialObjs;
  }
  
  // Update geometry-derived columns on the geospatial objects
  // update app_fom.cut_block set planned_area_ha = ST_AREA(geometry)/10000 where submission_id = {};
  // update app_fom.retention_area set planned_area_ha = ST_AREA(geometry)/10000 where submission_id = {};
  // update app_fom.road_section set planned_length_km  = ST_Length(geometry)/1000 where submission_id = {};
  async updateGeospatialAreaOrLength(spatialObjectCode: SpatialObjectCodeEnum, submissionId: number, spatialObjects: SpatialObject[]) {
    this.logger.info(`Method updateGeospatialAreaOrLength called with spatialObjectCode:${spatialObjectCode}, 
      submissionId:${submissionId} and spatialObjects:${JSON.stringify(spatialObjects)}`)
    let entityName: string;
    let setClause: object;
    switch (spatialObjectCode) {
      case SpatialObjectCodeEnum.ROAD_SECTION:
        entityName = RoadSection.name;
        setClause = { plannedLengthKm: () => 'ST_Length(geometry)/1000' };
        break;
      case SpatialObjectCodeEnum.WTRA:
        entityName = RetentionArea.name;
        setClause = { plannedAreaHa: () => 'ST_AREA(geometry)/10000' };
        break;
      default:
        entityName = CutBlock.name;
        setClause = { plannedAreaHa: () => 'ST_AREA(geometry)/10000' };
    }

    await Promise.all(spatialObjects.map(async (s) => {
      await getConnection()
      .createQueryBuilder()
      .update(entityName)
      .set(setClause)
      .where("submission_id = :submissionId", { submissionId })
      .execute();
    }));
  }

  // Update project location
  async updateProjectLocation(projectId: number, user: User) {
    this.logger.info(`Updating project location for projectId: ${projectId}`);
    await getManager().query(`
      with project_geometries as (
        select s.project_id, cb.geometry from app_fom.cut_block cb join app_fom.submission s on cb.submission_id = s.submission_id 
        union 
        select s.project_id, rs.geometry from app_fom.road_section rs join app_fom.submission s on rs.submission_id = s.submission_id 
        union 
        select s.project_id, ra.geometry from app_fom.retention_area ra join app_fom.submission s on ra.submission_id = s.submission_id
      )
      update app_fom.project p set 
        geometry_latlong = (select ST_Transform(ST_centroid(ST_COLLECT(g.geometry)),4326) from project_geometries g where g.project_id = p.project_id),
        update_timestamp = now(),
        update_user = $2,
        revision_count = (select revision_count+1 from app_fom.project p2 where p.project_id = p2.project_id )
      where p.project_id = $1;
    `, [projectId, user.userName]);
    this.logger.info(`Project location updated for projectId: ${projectId}`);
  }

}