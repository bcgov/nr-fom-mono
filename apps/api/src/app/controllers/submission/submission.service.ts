import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionWithJsonDto } from './dto/submission-with-json.dto';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { Project } from '../project/entities/project.entity';
import { PinoLogger } from 'nestjs-pino';
import { SubmissionTypeCode } from '../submission-type-code/entities/submission-type-code.entity';
import { WorkflowStateCode } from '../workflow-state-code/entities/workflow-state-code.entity';

@Injectable()
export class SubmissionService extends DataService<
  Submission,
  Repository<Submission>
> {
  constructor(
    @InjectRepository(Submission)
    repository: Repository<Submission>,
    logger: PinoLogger
  ) {
    super(repository, new Submission(), logger);
  }

  /**
   * Create or replace a spatial submission.
   */
  async processSpatialSubmission(dto: Partial<SubmissionWithJsonDto>): Promise<any> {       
    this.logger.info(`${this.constructor.name}.create props`, dto);
  
    // Load the existing project to obtain the project's workflow state
    const project: Project = {} as Project;
    if (project.workflow_state_code === WorkflowStateCode.CODES.INITIAL) {
    }

    // The submission type that is allowed to be done depends on the workflow state:
    // INITIAL = PROPOSED
    // COMMENTING_OPEN = FINAL
    // COMMENTING_CLOSED = FINAL
    // FINALIZED/EXPIRED = none (return an error)

    // Confirm that the dto.submissionTypeCode equals what we expect. If not, return an error.
    if (dto.submissionTypeCode === SubmissionTypeCode.CODES.FINAL) {
    }

    // Obtain existing submission for the submission type
    const existingSubmissions: Submission[] = await this.repository.find({
      where: { project_id: dto.projectId, submission_type_code: dto.submissionTypeCode },
      // relations: ['district', 'forest_client', 'workflow_state'],
    });

    // If existing submission of type doesn't exist create it.
    var submission: Submission;
    var existing = false;
    if (existingSubmissions.length == 0) {
      submission = new Submission;
      // Populate fields
    } else {
      submission = existingSubmissions[0]
      existing=true;
    }

    if (existing) {
      // Delete all existing geospatial objects corresponding to the dto.spatialObjectCode
    }

    if (!existing) {
      // Save the submission first in order to populate primary key.
    }

    // Create the new geospatial objects parsed from the dto.jsonSpatialSubmission as children of the submission. 

    // Validate that the dto.jsonSpatialSubmission is valid. Parse into cut_block, road_section, or WTRA objects based on dto.spatialObjectCode

    // Confirm that all geometrics fall within the BC bounds (to catch errors using e.g. lat/lon coordinates)
    // As a first approximation, the bounds for BC/Albers 3005 are:
    // Projected Bounds: 35043.6538, 440006.8768, 1885895.3117, 1735643.8497

    // Save the geospatial objects

    // Update geometry-derived columns on the geospatial objects
//		update app_fom.cut_block set planned_area_ha = ST_AREA(geometry)/10000 where submission_id = {};
//		update app_fom.retention_area set planned_area_ha = ST_AREA(geometry)/10000 where submission_id = {};
//		update app_fom.road_section set planned_length_km  = ST_Length(geometry)/1000 where submission_id = {};

    // Update project location
/*
		with project_geometries as (
			select s.project_id, cb.geometry from app_fom.cut_block cb join app_fom.submission s on cb.submission_id = s.submission_id 
			union 
			select s.project_id, rs.geometry from app_fom.road_section rs join app_fom.submission s on rs.submission_id = s.submission_id 
			union 
			select s.project_id, ra.geometry from app_fom.retention_area ra join app_fom.submission s on ra.submission_id = s.submission_id
		)
		update app_fom.project p set 
      geometry = (select ST_centroid(ST_COLLECT(g.geometry)) from project_geometries g where g.project_id = p.project_id),
 			update_timestamp = now(),
			update_user = 'FAKEUSER'
		where p.project_id = {};

*/
      // Remember to populate audit columns createUser, revisionCount, updateUser, updateTimestamp.

    // Unsure if need to return anything. Probably not, just have screen reload the project details.
  }
}
