import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getManager, Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { FomSpatialJson, SpatialObjectCodeEnum, SubmissionWithJsonDto } from './dto/submission-with-json.dto';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { ProjectService } from '../project/project.service';
import { PinoLogger } from 'nestjs-pino';
import { SubmissionTypeCodeEnum } from '../submission-type-code/entities/submission-type-code.entity';
import { WorkflowStateCode } from '../workflow-state-code/entities/workflow-state-code.entity';
import { CutBlock } from '../cut-block/entities/cut-block.entity';
import { RoadSection } from '../road-section/entities/road-section.entity';
import { RetentionArea } from '../retention-area/entities/retention-area.entity';
import { GeoJsonProperties, Geometry, Polygon, Position } from 'geojson';
import * as dayjs from 'dayjs';
import * as customParseFormat  from 'dayjs/plugin/customParseFormat';
import { ProjectDto } from '../project/dto/project.dto';
import { flatDeep } from '../../../core/utils';

@Injectable()
export class SubmissionService extends DataService<
  Submission,
  Repository<Submission>
> {

  @Inject('ProjectService')
  private projectService: ProjectService;

  private user: string = 'testdata'; // TODO: !find out where user is from!

  constructor(
    @InjectRepository(Submission)
    repository: Repository<Submission>,
    logger: PinoLogger
  ) {
    super(repository, new Submission(), logger);
    dayjs.extend(customParseFormat)
  }

  /**
   * Create or replace a spatial submission.
   */
  async processSpatialSubmission(dto: Partial<SubmissionWithJsonDto>): Promise<any> {       
    this.logger.info(`${this.constructor.name}.create props`, dto);

    // Load the existing project to obtain the project's workflow state
    const project: ProjectDto = await this.projectService.findOne(dto.projectId);
    const workflowStateCode = project.workflowStateCode;
    const submissionTypeCode = this.getPermittedSubmissionTypeCode(workflowStateCode);

    // Confirm that the dto.submissionTypeCode equals what we expect. If not, return an error. 
    // @see {getPermittedSubmissoinStatus} comment.
    if (!submissionTypeCode || submissionTypeCode !== dto.submissionTypeCode) {
      const errMsg = `Submission (${dto.submissionTypeCode}) is not allowed for workflow_state_code ${workflowStateCode}.`;
      this.logger.error(errMsg);
      throw new HttpException(errMsg, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // Obtain Submission(or new one) so we have the id.
    let submission = await this.obtainExistingOrNewSubmission(dto.projectId, submissionTypeCode);

    let spatialObjects: (CutBlock | RoadSection | RetentionArea)[];
    spatialObjects = await this.prepareFomSpatialObjects(submission.id, dto.spatialObjectCode, dto.jsonSpatialSubmission);

    // And save the geospatial objects (will update/replace previous ones)
    if (SpatialObjectCodeEnum.CUT_BLOCK === dto.spatialObjectCode) {
      submission.cut_blocks = <CutBlock[]>spatialObjects;
    }
    else if (SpatialObjectCodeEnum.ROAD_SECTION === dto.spatialObjectCode) {
      submission.road_sections = <RoadSection[]>spatialObjects;
    }
    else {
      submission.retention_areas = <RetentionArea[]>spatialObjects;
    }
    submission = await this.repository.save(submission);

    await this.updateGeospatialAreaOrLength(dto.spatialObjectCode, submission.id, spatialObjects);

    await this.updateProjectLocation(project.id);
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
  async obtainExistingOrNewSubmission(projectId: number, submissionTypeCode: SubmissionTypeCodeEnum): Promise<Submission>  {
    // Obtain existing submission for the submission type
    const existingSubmissions: Submission[] = await this.repository.find({
      where: { project_id: projectId, submission_type_code: submissionTypeCode },
      relations: ['cut_blocks', 'retention_areas', 'road_sections'],
    });

    let submission: Submission;
    if (existingSubmissions.length == 0) {
      // Save the submission first in order to populate primary key.
      // Populate fields
      submission = new Submission({             
        project_id: projectId,
        submission_type_code: submissionTypeCode,
        create_user: this.user
      })
      submission = await this.repository.save(submission);

    } else {
      submission = existingSubmissions[0];
    }

    this.logger.debug(`Obtained submission: ${JSON.stringify(submission)}`);
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
  validateFomSpatialSubmission(spatialObjectCode: SpatialObjectCodeEnum, jsonSpatialSubmission: FomSpatialJson): 
    (CutBlock | RoadSection | RetentionArea)[] {

    // spatial objects holder to be parsed into.
    let spatialObjs: (CutBlock | RoadSection | RetentionArea)[];
    const features = jsonSpatialSubmission.features;
    const REQUIRED_PROP_DEVELOPMENT_DATE = 'DEVELOPMENT_DATE';
    const OPTIONAL_PROP_NAME = "NAME";
    const DATE_FORMAT = "YYYY-MM-DD";

    // validation - Validate each point(Position) is within BC bounding box.
    // BC bounding box: 1665146.77055,1725046.3621 to 33240.8114887,445948.165738.
    const validateCoordWithinBounding = (geometry: Geometry) => {
      const bb = {ix: 33240.8114887, iy: 445948.165738, ax: 1665146.77055, ay: 1725046.3621};
      const coordinates = (<Polygon>geometry).coordinates;
      flatDeep(coordinates).forEach( (p: Position) => {
        if( !(bb.ix <= p[0] && p[0] <= bb.ax && bb.iy <= p[1] && p[1] <= bb.ay) ) {
          const errMsg = `Coordinate (${p}) is not within BC bounding box ${JSON.stringify(bb)}.`;
          this.logger.error(errMsg);
          throw new HttpException(errMsg, HttpStatus.UNPROCESSABLE_ENTITY);
        }
      });
    };

    // validation - development_date
    const validateDevelopmentDate = (properties: GeoJsonProperties) => {
      if (spatialObjectCode === SpatialObjectCodeEnum.CUT_BLOCK || 
          spatialObjectCode === SpatialObjectCodeEnum.ROAD_SECTION) {
        if (!properties.hasOwnProperty(REQUIRED_PROP_DEVELOPMENT_DATE)) {
          const errMsg = `Required property ${REQUIRED_PROP_DEVELOPMENT_DATE} missing for ${spatialObjectCode}`;
          this.logger.error(errMsg);
          throw new HttpException(errMsg, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        else {
          // validate date format: YYYY-MM-DD
          const developmentDate = properties[REQUIRED_PROP_DEVELOPMENT_DATE];
          if (!dayjs(developmentDate, DATE_FORMAT).isValid()) {
            const errMsg = `Required property ${REQUIRED_PROP_DEVELOPMENT_DATE} has wrong date format. Valid format: '${DATE_FORMAT}'`;
            this.logger.error(errMsg);
            throw new HttpException(errMsg, HttpStatus.UNPROCESSABLE_ENTITY);
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
          create_user: this.user,
          'planned_development_date': properties[REQUIRED_PROP_DEVELOPMENT_DATE]});
      }
      else if (spatialObjectCode === SpatialObjectCodeEnum.ROAD_SECTION) {
        // validate required properties.
        validateDevelopmentDate(properties);
        return new RoadSection({name, geometry,
          create_user: this.user,
          'planned_development_date': properties[REQUIRED_PROP_DEVELOPMENT_DATE]});
      }
      else {
        return new RetentionArea({geometry, create_user: this.user});
      }
    });

    return spatialObjs;
  }

  /** 
   * @param spatialObjectCode 
   * @param jsonSpatialSubmission 
   * @returns Create the new geospatial objects parsed from the dto.jsonSpatialSubmission as children of the submission.
   */
  async prepareFomSpatialObjects(submissionId: number, spatialObjectCode: SpatialObjectCodeEnum, jsonSpatialSubmission: FomSpatialJson) 
    :Promise<(CutBlock | RoadSection | RetentionArea)[]> {
    this.logger.info(`Method prepareFomSpatialObjects called with spatialObjectCode:${spatialObjectCode}
        and jsonSpatialSubmission ${JSON.stringify(jsonSpatialSubmission)}`);

    let spatialObjs = this.validateFomSpatialSubmission(spatialObjectCode, jsonSpatialSubmission);
    spatialObjs.forEach((s) => {s.submission_id = submissionId}); // assign them to the submission 

    this.logger.info(`FOM spatial objects prepared: ${JSON.stringify(spatialObjs)}`);
    return spatialObjs;
  }
  
  // Update geometry-derived columns on the geospatial objects
  // update app_fom.cut_block set planned_area_ha = ST_AREA(geometry)/10000 where submission_id = {};
  // update app_fom.retention_area set planned_area_ha = ST_AREA(geometry)/10000 where submission_id = {};
  // update app_fom.road_section set planned_length_km  = ST_Length(geometry)/1000 where submission_id = {};
  async updateGeospatialAreaOrLength(spatialObjectCode: SpatialObjectCodeEnum, submissionId: number, spatialObjects: (CutBlock | RoadSection | RetentionArea)[]) {
    this.logger.info(`Method updateGeospatialAreaOrLength called with spatialObjectCode:${spatialObjectCode}, 
      submissionId:${submissionId} and spatialObjects:${JSON.stringify(spatialObjects)}`)
    let entityName: string;
    let setClause: object;
    switch (spatialObjectCode) {
      case SpatialObjectCodeEnum.ROAD_SECTION:
        entityName = RoadSection.name;
        setClause = { planned_length_km: () => 'ST_Length(geometry)/1000' };
        break;
      case SpatialObjectCodeEnum.WTRA:
        entityName = RetentionArea.name;
        setClause = { planned_area_ha: () => 'ST_AREA(geometry)/10000' };
        break;
      default:
        entityName = CutBlock.name;
        setClause = { planned_area_ha: () => 'ST_AREA(geometry)/10000' };
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
  async updateProjectLocation(projectId: number) {
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
    `, [projectId, this.user]);
    this.logger.info(`Project location updated for projectId: ${projectId}`);
  }

}