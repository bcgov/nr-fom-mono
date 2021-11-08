import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { GeoJsonProperties, Geometry, LineString, Polygon, Position } from 'geojson';
import * as dayjs from 'dayjs';
import * as customParseFormat  from 'dayjs/plugin/customParseFormat';
import { PinoLogger } from 'nestjs-pino';

import { Submission } from './submission.entity';
import { FomSpatialJson, SpatialCoordSystemEnum, SpatialObjectCodeEnum, SubmissionRequest } from './submission.dto';
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
        throw new BadRequestException(`Invalid spatialObjectCode ${spatialObjectCode}.`); 
    }
  }

  private getDevelopmentDate(properties): string {
    // Support DEVELOPMENT_DATE for backwards compatibility, but official property name is DEV_DATE
    return properties['DEV_DATE'] || properties['DEVELOPMENT_DATE'] || null;
  }

  /**
   * Parse into cut_block, road_section, or WTRA objects based on spatialObjectCode. 
   * 
   * @param spatialObjectCode 
   * @param jsonSpatialSubmission 
   * @returns spatial objects into cut_block, road_section, or WTRA objects based on dto.spatialObjectCode.
   */
  async parseFomSpatialSubmission(spatialObjectCode: SpatialObjectCodeEnum, jsonSpatialSubmission: FomSpatialJson, user: User): 
    Promise<SpatialObject[]> {

    // do validation before parsing
    await this.basicSpatialFileChecks(spatialObjectCode, jsonSpatialSubmission);

    const features = jsonSpatialSubmission.features;
    const OPTIONAL_PROP_NAME = "NAME";

    return features.map(f => {
      const geometry = f.geometry;
      const properties = f.properties;
      let name: string;
      if (properties && properties.hasOwnProperty(OPTIONAL_PROP_NAME)) {
        name = properties[OPTIONAL_PROP_NAME];
      }
      let devDate: string;
      if (properties && spatialObjectCode != SpatialObjectCodeEnum.WTRA) {
        devDate = this.getDevelopmentDate(properties);
      }

      if (spatialObjectCode === SpatialObjectCodeEnum.CUT_BLOCK) {
        return new CutBlock({name, geometry,
          createUser: user.userName,
          plannedDevelopmentDate: devDate});
      }
      else if (spatialObjectCode === SpatialObjectCodeEnum.ROAD_SECTION) {
        return new RoadSection({name, geometry,
          createUser: user.userName,
          plannedDevelopmentDate: devDate});
      }
      else {
        return new RetentionArea({geometry, createUser: user.userName});
      }
    });
  }

  /**
   * Basic check for spatial submission GeoJSON.
   * Note!: internally it auto detects the spatial coordinates used with the submission. If the submission is not using
   * BC Albers, it will attempt to convert jsonSpatialSubmission object into BC Albers system and mutate original jsonSpatialSubmission.
   * 
   * @param spatialObjectCode GeoSpatial object type to indiate the spatial submission: CUT_BLOCK, ROAD_SECTION, WTRA.
   * @param jsonSpatialSubmission the GeoJSON spatial submission.
   */
  private async basicSpatialFileChecks(spatialObjectCode: SpatialObjectCodeEnum, jsonSpatialSubmission: FomSpatialJson): Promise<void> {
    if (!spatialObjectCode || 
        ![SpatialObjectCodeEnum.CUT_BLOCK, SpatialObjectCodeEnum.ROAD_SECTION, SpatialObjectCodeEnum.WTRA]
        .includes(spatialObjectCode)) {
        throw new BadRequestException(`Invalid spatialObjectCode ${spatialObjectCode}.`);
    }

    if (!jsonSpatialSubmission || _.isEmpty(jsonSpatialSubmission) || _.isEmpty(jsonSpatialSubmission.features)) {
      throw new BadRequestException("Invalid formated JSON submission file or spatial submission is empty.")
    }

    const crs = jsonSpatialSubmission.crs;
    if (!_.isEmpty(crs)) {
      if (!crs.properties || !crs.properties.name || crs.properties.name != 'EPSG:3005') {
        throw new BadRequestException(`Invalid CRS for ${spatialObjectCode}. Should match specification: { "name": "EPSG:3005" }.`);
      }
    }
    
    // do this check first before each feature check in depth.
    this.validateGeometry(spatialObjectCode, jsonSpatialSubmission);

    // Detect referencing system used from submission: BC Albers (EPSG:3005) or WGS84 (EPSG:4326)
    const coordSystemRef = this.detectSpatialSubmissionCoordRef(jsonSpatialSubmission);
    this.logger.debug(`Coordinate system: EPSG${coordSystemRef} detected for the spatial submission:`, JSON.stringify(jsonSpatialSubmission));

    for (const f of jsonSpatialSubmission.features) {
      let geometry = f.geometry;
      if (coordSystemRef !== SpatialCoordSystemEnum.BC_ALBERS) {
        const convertedGeometryJson = await this.convertGeometry(JSON.stringify(geometry), SpatialCoordSystemEnum.BC_ALBERS);
        f.geometry = geometry = JSON.parse(convertedGeometryJson);
      }

      this.validateCoordWithinBounding(geometry, (coordSystemRef !== SpatialCoordSystemEnum.BC_ALBERS));

      this.validateRequiredProperties(spatialObjectCode, f.properties);
    }
  }

  private validateGeometry(spatialObjectCode: SpatialObjectCodeEnum, jsonSpatialSubmission: FomSpatialJson): void {

    const qualifiedGeometryType: 'Polygon'| 'LineString' = this.getQualifiedGeometryType(spatialObjectCode);
    for (const f of jsonSpatialSubmission.features) {
      const geometry = f.geometry;
      if (!geometry || _.isEmpty(geometry)) {
        throw new BadRequestException(`Required Feature object 'geometry' is missing for ${spatialObjectCode}.`);
      }

      if (!geometry.type) {
        throw new BadRequestException(`Required Geometry 'type' field is missing for ${spatialObjectCode}.`);
      }
      if (geometry.type !== qualifiedGeometryType) {
        throw new BadRequestException(`Submission file contains invalid geometry type: ${geometry.type}.`);
      }

      const coordinates = geometry['coordinates'];
      if (!coordinates || _.isEmpty(coordinates)) {
        throw new BadRequestException(`Required Geometry 'coordinates' field is missing for ${spatialObjectCode}.`);
      }
    }
  }

  /** required 'properties' check for different spatial objects (Road Section, Cut Block, WTRA)
   * Road Section: required - DEV_DATE	
   *               optional - NAME
   * Cut Block:   required - DEV_DATE	
   *               optional - NAME
   * WTRA:        required - N/A
   *              optional - NAME
  */
  private validateRequiredProperties(spatialObjectCode: SpatialObjectCodeEnum, properties: GeoJsonProperties) {
    if (spatialObjectCode === SpatialObjectCodeEnum.CUT_BLOCK || 
        spatialObjectCode === SpatialObjectCodeEnum.ROAD_SECTION) {
      if (!properties || _.isEmpty(properties)) {
        throw new BadRequestException(`Required Feature object 'properties' missing for ${spatialObjectCode}.`);
      }

      // validation - development_date
      const DATE_FORMAT = DateTimeUtil.DATE_FORMAT;
      if (!properties.hasOwnProperty('DEV_DATE') && !properties.hasOwnProperty('DEVELOPMENT_DATE')) {
        const errMsg = `Required property DEV_DATE missing for ${spatialObjectCode}.`;
        throw new BadRequestException(errMsg);
      }
      else {
        // validate date format: YYYY-MM-DD
        const developmentDate = this.getDevelopmentDate(properties);
        if (!dayjs(developmentDate, DATE_FORMAT).isValid()) {
          const errMsg = `Required property DEV_DATE has wrong date format. Valid format: '${DATE_FORMAT}'.`;
          throw new BadRequestException(errMsg);
        }
      }
    }
  }

  // validation - Validate each point(Position) is within BC bounding box.
  // Coordinates based on epsg.io visual inspesction in EPSG 3005 (BC Albers) coordinates 
  private validateCoordWithinBounding(geometry: Geometry, useGenericErrorMsg: boolean): void {
    const bb = {minx: 270000, miny: 360000, maxx: 1900000, maxy: 1750000};
    const coordinates = (<Polygon | LineString> geometry).coordinates;
    const d = (geometry.type == 'Polygon') ? 1 : 0 // flatten d level (dimension) down for an array. Assume geometry is either 'Polygon' or 'LineString' type for now.
    flatDeep(coordinates, d).forEach( (p: Position) => {
      if( !(bb.minx <= p[0] && p[0] <= bb.maxx && bb.miny <= p[1] && p[1] <= bb.maxy) ) {
        // Add spacing to bounding box.
        const errMsg = !useGenericErrorMsg? `Coordinate (${p}) is not within the boundary of British Columbia ${JSON.stringify(bb).split(',').join(', ')}.`
                                          : `Some coordinates are not within the boundary of British Columbia.`;
        throw new BadRequestException(errMsg); 
      }
    });
  }

  /**
   * Detect referencing system used from submission: 
   *  BC Albers (EPSG:3005) or 
   *  WGS84 (EPSG:4326)
   * Current system assumes if it is not WGS84 (using lat/long) then it is BC Albers,
   * by checking if crs optional field is presented for BC Albers system; or by checking
   * Abs(coordinate) that is within 360 degree for WGS84.
   * @param jsonSpatialSubmission 
   */
  detectSpatialSubmissionCoordRef(jsonSpatialSubmission: FomSpatialJson) {
    const crs = jsonSpatialSubmission.crs;
    if (!_.isEmpty(crs) && crs?.properties?.name == 'EPSG:3005') {
      return SpatialCoordSystemEnum.BC_ALBERS;
    }
    else {
      // assuming all geometry are using the same reference system.
      const feature = jsonSpatialSubmission.features[0];
      const type = feature.geometry?.type;
      return this.detectGeometryCoordRef(feature.geometry, type as 'LineString' | 'Polygon');
    }
  }

  private detectGeometryCoordRef(geometry: Geometry, type: 'LineString' | 'Polygon') {
    const maxRange_WGS84 = 360; // Note: we choose 360 for now (although WGS84 lat/long ranging from 180:-180) to distinguish 
                                // between WGS84 and BC Albers.
    let p_zero: number;
    try {
      if (type == 'Polygon') {
        p_zero = geometry['coordinates'][0][0][0];
      }
      else if (type == 'LineString') {
        p_zero = geometry['coordinates'][0][0];
      }
    }
    catch (error) {
      throw new BadRequestException(`Problem parsing spatial submission file. 
            Coordinates might be of wrong format for ${geometry.type} geometry type.: ${error}`);
    }

    if (Math.abs(p_zero) > maxRange_WGS84) {
      return SpatialCoordSystemEnum.BC_ALBERS;
    }
    return SpatialCoordSystemEnum.WGS84;
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

    const spatialObjs = await this.parseFomSpatialSubmission(spatialObjectCode, jsonSpatialSubmission, user);
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

 /**
  * Use PostGIS Geometry functions to transform from one coordinate system to another.
  * Example:
  *   select ST_AsGeoJson(ST_Transform(
  *     ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[
  *                           [-119.397280854,49.815298833],[-119.394459294,49.815127941],
  *                           [-119.394863101,49.812334408],[-119.39768449,49.812505292],[-119.397280854,49.815298833]
  *                        ]]}')
  *     , 3005)) as transform;
  * 
  *   will be converted to:
  *    {"type":"Polygon","crs":{"type":"name","properties":{"name":"EPSG:3005"}},
  *     "coordinates":[[
  *         [1474613.999997578,555391.999955864],[1474818.000019682,555392.000057264],[1474818.000027833,555079.999953587],
  *         [1474614.000024779,555080.000049848],[1474613.999997578,555391.999955864]
  *     ]]}
  * 
  * @param geometry geometry from GeoJSON as JSON string
  * @param srid The EPSG code used as spatial reference identifier (SRID) with a specific coordinate system
  */
  async convertGeometry(geometry: string, srid: number): Promise<string> {
    this.logger.debug(`Coverting geometry to EPSG${srid} with geometry: ${geometry}`)
    try {
      const convertedGeometryResult = await getConnection()
      .query(
        `
          SELECT ST_AsGeoJson(ST_Transform(ST_GeomFromGeoJSON($1), CAST($2 AS INTEGER)))
          AS transform
        `, [geometry, srid]
      );
      this.logger.debug(`Convert geometry successfully: `, convertedGeometryResult[0].transform)
      return convertedGeometryResult[0].transform;
    }
    catch (error) {
      throw new BadRequestException(`Failed on converting geometry: ${geometry} using spatial reference EPSG ${srid}: ${error}`);
    }
  }
}
