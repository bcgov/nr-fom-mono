import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { SubmissionWithJsonDto } from './dto/submission-with-json.dto';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { Project } from '../project/entities/project.entity';
import { ProjectService } from '../project/project.service';
import { PinoLogger } from 'nestjs-pino';
import { SubmissionTypeCodeEnum } from '../submission-type-code/entities/submission-type-code.entity';
import { WorkflowStateCode } from '../workflow-state-code/entities/workflow-state-code.entity';
import { SubmissionTypeCodeService } from '../submission-type-code/submission-type-code.service';

@Injectable()
export class SubmissionService extends DataService<
  Submission,
  Repository<Submission>
> {

  @Inject('ProjectService')
  private projectService: ProjectService;

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
    const project: Project = await this.projectService.findOne(dto.projectId);
    const workflowStateCode = project.workflow_state_code;
    const submissionTypeCode = this.getPermittedSubmissionTypeCode(workflowStateCode);

    // Confirm that the dto.submissionTypeCode equals what we expect. If not, return an error. 
    // @see {getPermittedSubmissoinStatus} comment.
    if (!submissionTypeCode || submissionTypeCode !== dto.submissionTypeCode) {
      const errMsg = `Submission (${dto.submissionTypeCode}) is not allowed for workflow_state_code ${workflowStateCode}.`;
      this.logger.error(errMsg);
      throw new HttpException(errMsg, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    let submission = await this.obtainExistingOrNewSubmission(dto.projectId, submissionTypeCode);

    // Delete all existing geospatial objects corresponding to the dto.spatialObjectCode

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

  async obtainExistingOrNewSubmission(projectId: number, submissionTypeCode: SubmissionTypeCodeEnum): Promise<Submission>  {
    // Obtain existing submission for the submission type
    const existingSubmissions: Submission[] = await this.repository.find({
      where: { project_id: projectId, submission_type_code: submissionTypeCode },
      // relations: ['district', 'forest_client', 'workflow_state'],
    });

    let submission: Submission;
    if (existingSubmissions.length == 0) {
      // Save the submission first in order to populate primary key.
      // Populate fields
      // TODO: populate user/time?
      submission = new Submission({             
        project_id: projectId,
        submission_type_code: submissionTypeCode
      })
      submission = await this.repository.save(submission);

    } else {
      submission = existingSubmissions[0];
    }
    return submission;
  }

}
