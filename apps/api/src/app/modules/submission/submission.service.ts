import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { GeoJsonProperties, Geometry, LineString, Polygon, Position } from 'geojson';
import * as dayjs from 'dayjs';
import * as customParseFormat  from 'dayjs/plugin/customParseFormat';
import { PinoLogger } from 'nestjs-pino';

import { Submission } from './submission.entity';
import { FomSpatialJson, SpatialObjectCodeEnum, SubmissionRequest } from './submission.dto';
import { ProjectService } from '../project/project.service';
import { SubmissionTypeCodeEnum } from './submission-type-code.entity';
import { WorkflowStateEnum } from '../project/workflow-state-code.entity';
import { CutBlock } from './cut-block.entity';
import { RoadSection } from './road-section.entity';
import { RetentionArea } from './retention-area.entity';
import { ProjectResponse } from '../project/project.dto';
import { flatDeep } from '../../../core/utils';
import { User } from "@api-core/security/user";
import { ProjectAuthService } from '../project/project-auth.service';
import _ = require('lodash');
import { DateTimeUtil } from '@api-core/dateTimeUtil';

type SpatialObject = CutBlock | RoadSection | RetentionArea;

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private repository: Repository<Submission>,
    private logger: PinoLogger,
    private projectService: ProjectService,
    private projectAuthService: ProjectAuthService
  ) {
    dayjs.extend(customParseFormat);
  }

  /**
   * Create or replace a spatial submission.
   */
  async processSpatialSubmission(dto: Partial<SubmissionRequest>, user: User): Promise<void> {       
    this.logger.debug(`${this.constructor.name}.create props %o`, dto);
    // Load the existing project to obtain the project's workflow state
    
    const project: ProjectResponse = await this.projectService.findOne(dto.projectId, user); // This invokes security authorization check which will always pass.
    const workflowStateCode = project.workflowState.code;
    const submissionTypeCode = this.getPermittedSubmissionTypeCode(workflowStateCode);

    // Operation only allowed for forest client users with project in specific states.
    if (!await this.projectAuthService.isForestClientUserAllowedStateAccess(dto.projectId, 
      [WorkflowStateEnum.INITIAL, WorkflowStateEnum.COMMENT_CLOSED], user)) {
      throw new ForbiddenException();
    }

    // Confirm that the dto.submissionTypeCode equals what we expect. If not, return an error. 
    // @see {getPermittedSubmissoinStatus} comment.
    if (!submissionTypeCode || submissionTypeCode !== dto.submissionTypeCode) {
      const errMsg = `Submission (${dto.submissionTypeCode}) is not allowed for workflow_state_code ${workflowStateCode}.`;
      throw new BadRequestException(errMsg);
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

    await this.updateProjectLocation(project.id, user);

    await this.updateGeospatialAreaOrLength(dto.spatialObjectCode, updatedSubmission.id);
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
      case WorkflowStateEnum.INITIAL:
        submissionTypeCode = SubmissionTypeCodeEnum.PROPOSED;
        break;

      case WorkflowStateEnum.COMMENT_CLOSED:
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

    let submission: Submission;
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
      // Saving update timestamp in UTC format is fine.
      submission.updateTimestamp = dayjs().toDate();
      submission.revisionCount += 1;
    }

    this.logger.debug('Obtained submission: %o', submission);
    return submission;
  }

  getQualifiedGeometryType(spatialObjectCode: SpatialObjectCodeEnum): 'Polygon'| 'LineString' {
    switch (spatialObjectCode) {
      case SpatialObjectCodeEnum.CUT_BLOCK:
        return 'Polygon';
      
      case SpatialObjectCodeEnum.WTRA:
        return 'Polygon';

      case SpatialObjectCodeEnum.ROAD_SECTION:
        return 'LineString';

      default:
        throw new BadRequestException(`Invalid spatialObjectCode ${spatialObjectCode}`); 
    }
  }
  
  /**
   * Parse into cut_block, road_section, or WTRA objects based on spatialObjectCode. 
   * 
   * @param spatialObjectCode 
   * @param jsonSpatialSubmission 
   * @returns spatial objects into cut_block, road_section, or WTRA objects based on dto.spatialObjectCode.
   */
  parseFomSpatialSubmission(spatialObjectCode: SpatialObjectCodeEnum, jsonSpatialSubmission: FomSpatialJson, user: User): 
    SpatialObject[] {

    // do validation before parsing
    this.basicSpatialFileChecks(spatialObjectCode, jsonSpatialSubmission);

    const features = jsonSpatialSubmission.features;
    const REQUIRED_PROP_DEVELOPMENT_DATE = 'DEVELOPMENT_DATE';
    const OPTIONAL_PROP_NAME = "NAME";

    const spatialObjs = features.map(f => {
      const geometry = f.geometry;
      const properties = f.properties;
      let name: string;
      if (properties && properties.hasOwnProperty(OPTIONAL_PROP_NAME)) {
        name = properties[OPTIONAL_PROP_NAME];
      }

      if (spatialObjectCode === SpatialObjectCodeEnum.CUT_BLOCK) {
        return new CutBlock({name, geometry,
          createUser: user.userName,
          plannedDevelopmentDate: properties[REQUIRED_PROP_DEVELOPMENT_DATE]});
      }
      else if (spatialObjectCode === SpatialObjectCodeEnum.ROAD_SECTION) {
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

  private basicSpatialFileChecks(spatialObjectCode: SpatialObjectCodeEnum, jsonSpatialSubmission: FomSpatialJson): void {
    if (!spatialObjectCode || 
        ![SpatialObjectCodeEnum.CUT_BLOCK, SpatialObjectCodeEnum.ROAD_SECTION, SpatialObjectCodeEnum.WTRA]
        .includes(spatialObjectCode)) {
        throw new BadRequestException(`Invalid spatialObjectCode ${spatialObjectCode}`);
    }

    if (!jsonSpatialSubmission || _.isEmpty(jsonSpatialSubmission) || _.isEmpty(jsonSpatialSubmission.features)) {
      throw new BadRequestException("Invalid formated JSON submission file or Spatial submission is empty!")
    }

    const crs = jsonSpatialSubmission.crs;
    if (!_.isEmpty(crs)) {
      if (!crs.properties || !crs.properties.name || crs.properties.name != 'EPSG:3005') {
        throw new BadRequestException(`Invalid CRS for ${spatialObjectCode}. 
                                        Should match specification: { "name": "EPSG:3005" }`);
      }
    }

    // do this check first before each feature check in depth.
    this.validateGeometryType(spatialObjectCode, jsonSpatialSubmission);

    jsonSpatialSubmission.features.forEach(f => {
      const geometry = f.geometry;

      if (!geometry || _.isEmpty(geometry)) {
        throw new BadRequestException(`Required Feature object 'geometry' is missing for ${spatialObjectCode}`);
      }

      if (!geometry.type) {
        throw new BadRequestException(`Required Geometry 'type' field is missing for ${spatialObjectCode}`);
      }

      const coordinates = geometry['coordinates'];
      if (!coordinates || _.isEmpty(coordinates)) {
        throw new BadRequestException(`Required Geometry 'coordinates' field is missing for ${spatialObjectCode}`);
      }

      this.validateCoordWithinBounding(geometry);

      this.validateRequiredProperties(spatialObjectCode, f.properties);
    });
  }

  // validate geometry type matches what user selected for spatialObject type
  private validateGeometryType(spatialObjectCode: SpatialObjectCodeEnum, jsonSpatialSubmission: FomSpatialJson): void {
    const qualifiedGeometryType: 'Polygon'| 'LineString' = this.getQualifiedGeometryType(spatialObjectCode);
    const invalidGeometryTypes = jsonSpatialSubmission.features.filter(f => {
      return f?.geometry?.type  !== qualifiedGeometryType;
    });
    if (invalidGeometryTypes && invalidGeometryTypes.length > 1) {
      const invalidTypes = invalidGeometryTypes.map(f => f.geometry.type);
      throw new BadRequestException(`Submission file contains invalid geometry type: 
                ${[...new Set(invalidTypes)].join(', ')}`);
    }
  }

  /** required 'properties' check for different spatial objects (Road Section, Cut Block, WTRA)
   * Road Section: required - DEVELOPMENT_DATE	
   *               optional - NAME
   * Cut Block:   required - DEVELOPMENT_DATE	
   *               optional - NAME
   * WTRA:        required - N/A
   *              optional - NAME
  */
  private validateRequiredProperties(spatialObjectCode: SpatialObjectCodeEnum, properties: GeoJsonProperties) {
    if (spatialObjectCode === SpatialObjectCodeEnum.CUT_BLOCK || 
        spatialObjectCode === SpatialObjectCodeEnum.ROAD_SECTION) {
      if (!properties || _.isEmpty(properties)) {
        throw new BadRequestException(`Required Feature object 'properties' missing for ${spatialObjectCode}`);
      }

      // validation - development_date
      const REQUIRED_PROP_DEVELOPMENT_DATE = 'DEVELOPMENT_DATE';
      const DATE_FORMAT = DateTimeUtil.DATE_FORMAT;
      if (!properties.hasOwnProperty(REQUIRED_PROP_DEVELOPMENT_DATE)) {
        const errMsg = `Required property ${REQUIRED_PROP_DEVELOPMENT_DATE} missing for ${spatialObjectCode}`;
        throw new BadRequestException(errMsg);
      }
      else {
        // validate date format: YYYY-MM-DD
        const developmentDate = properties[REQUIRED_PROP_DEVELOPMENT_DATE];
        if (!dayjs(developmentDate, DATE_FORMAT).isValid()) {
          const errMsg = `Required property ${REQUIRED_PROP_DEVELOPMENT_DATE} has wrong date format. 
                          Valid format: '${DATE_FORMAT}'`;
          throw new BadRequestException(errMsg);
        }
      }
    }
  }

  // validation - Validate each point(Position) is within BC bounding box.
  // Coordinates based on epsg.io visual inspesction in EPSG 3005 (BC Albers) coordinates 
  private validateCoordWithinBounding(geometry: Geometry): void {
    const bb = {minx: 270000, miny: 360000, maxx: 1900000, maxy: 1750000};
    const coordinates = (<Polygon | LineString> geometry).coordinates;
    const d = (geometry.type == 'Polygon') ? 1 : 0 // flatten d level (dimension) down for an array. Assume geometry is either 'Polygon' or 'LineString' type for now.
    flatDeep(coordinates, d).forEach( (p: Position) => {
      if( !(bb.minx <= p[0] && p[0] <= bb.maxx && bb.miny <= p[1] && p[1] <= bb.maxy) ) {
        // Add spacing to bounding box.
        const errMsg = `Coordinate (${p}) is not within the boundary of British Columbia ${JSON.stringify(bb).split(',').join(', ')}.`;
        throw new BadRequestException(errMsg); 
      }
    });
  }

  /** 
   * @param spatialObjectCode 
   * @param jsonSpatialSubmission 
   * @returns Create the new geospatial objects parsed from the dto.jsonSpatialSubmission as children of the submission.
   */
  async prepareFomSpatialObjects(submissionId: number, spatialObjectCode: SpatialObjectCodeEnum, jsonSpatialSubmission: FomSpatialJson, user: User) 
    :Promise<SpatialObject[]> {
    this.logger.debug(`Method prepareFomSpatialObjects called with spatialObjectCode:${spatialObjectCode}
        and jsonSpatialSubmission ${JSON.stringify(jsonSpatialSubmission)}`);

    const spatialObjs = this.parseFomSpatialSubmission(spatialObjectCode, jsonSpatialSubmission, user);
    spatialObjs.forEach((s) => {s.submissionId = submissionId}); // assign them to the submission 

    this.logger.debug('FOM spatial objects prepared: %o', spatialObjs);
    return spatialObjs;
  }
  
  // Update geometry-derived columns on the geospatial objects
  // update app_fom.cut_block set planned_area_ha = ST_AREA(geometry)/10000 where submission_id = {};
  // update app_fom.retention_area set planned_area_ha = ST_AREA(geometry)/10000 where submission_id = {};
  // update app_fom.road_section set planned_length_km  = ST_Length(geometry)/1000 where submission_id = {};
  async updateGeospatialAreaOrLength(spatialObjectCode: SpatialObjectCodeEnum, submissionId: number) {
    this.logger.debug(`Method updateGeospatialAreaOrLength called with spatialObjectCode:${spatialObjectCode} and submissionId:${submissionId}`);

    switch (spatialObjectCode) {
      case SpatialObjectCodeEnum.ROAD_SECTION:
        await getConnection().createQueryBuilder()
          .update(RoadSection.name)
          .set({ plannedLengthKm: () => 'ST_Length(geometry)/1000' })
          .where("submission_id = :submissionId", { submissionId })
          .execute();
        break;
      case SpatialObjectCodeEnum.WTRA:
        await getConnection().createQueryBuilder()
          .update(RetentionArea.name)
          .set({ plannedAreaHa: () => 'ST_AREA(geometry)/10000' })
          .where("submission_id = :submissionId", { submissionId })
          .execute();
        break;
      case SpatialObjectCodeEnum.CUT_BLOCK:
        await getConnection().createQueryBuilder()
          .update(CutBlock.name)
          .set({ plannedAreaHa: () => 'ST_AREA(geometry)/10000' })
          .where("submission_id = :submissionId", { submissionId })
          .execute();
        break;
      default:
        throw new BadRequestException("Unrecognized spatial object code.");
    }
  }

  // Update project location
  async updateProjectLocation(projectId: number, user: User) {
    this.logger.debug(`Updating project location for projectId: ${projectId}`);
    await getConnection().query(`
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
    this.logger.debug(`Project location updated for projectId: ${projectId}`);
  }

}