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
  async processSpatialSubmission(
    dto: Partial<SubmissionWithJsonDto>
  ): Promise<any> {
    this.logger.info(`${this.constructor.name}.create props`, dto);

    // Check for existing submission for this project.
    const existingSubmissions: Submission[] = await this.repository.find({
      where: { project_id: dto.projectId },
      //      relations: ['district', 'forest_client', 'workflow_state'],
    });

    const existingSubmission: Submission = existingSubmissions[0];
    if (
      existingSubmission.submission_type_code ==
      SubmissionTypeCode.CODES.PROPOSED
    ) {
    }

    const project: Project = {} as Project;
    //    const project: Project = await this.projectService.findOne(dto.projectId);
    if (project.workflow_state_code == WorkflowStateCode.CODES.INITIAL) {
    }

    if (dto.submissionTypeCode == SubmissionTypeCode.CODES.FINAL) {
    }

    // Scenarios:
    // It is possible for the 'cannot submit' options to restrict the choice of submission type in the UI to only the allowed option.

    // # of existing submissions for the project | specified submission type | type(s) of the existing submission(s) | action to take
    // existingSubmissions.length | dto.submissionTypeCode | existingSubmissions[].submision_type_code
    // 0 | FINAL    | n/a               | invalid - cannot submit a final submission if there is no proposed submission.
    // 0 | PROPOSED | n/a               | valid - create the new submission along with the supplied spatial objects of the specified type (block/section/wtra)
    // 1 | PROPOSED | PROPOSED          | if project.workflow_state != INITIAL then invalid - cannot update a proposed submission once commenting has started. Otherwise valid - update the submission. For the specified spatial object type (block/section/wtra), delete all existing spatial objects and populate with what was supplied.
    // 1 | FINAL    | PROPOSED          | if project.workflow_state != COMMENT_CLOSED  then invalid - cannot submit a final submission until commenting is closed, or after the FOM is finalized. Otherwise valid - create a new submission along with the supplied spatial objects.
    // 2 | FINAL    | PROPOSED+FINAL    | if project.workflow state != COMMENT_CLOSED then invalid - cannot update a final submission before commenting is closed or after the FOM is finalized. Otherwise, update the existing FINAL submission.
    // 2 | PROPOSED | any               | invalid - cannot submit a proposed submission once a final submission exists.
    // Any other scenario is invalid:
    // 1 | any      | FINAL             | Should not be possible (have only a final fom, no proposed)
    // 2 | FINAL    | PROPOSED+PROPOSED | Should not be possible (cannot have two proposed submissions).

    /*      
      dto.createUser = 'FAKED USER';
      dto.revisionCount = 0;
      dto.updateUser = null;
      dto.updateTimestamp = null;
  
      const model = this.entity.factory(mapToEntity(dto as C, {} as E));
      const created = await this.repository.save(model);
  
      this.logger.info(`${this.constructor.name}.create result`, created);
  
      const createdDto = {} as C;
      return mapFromEntity(created, createdDto);
*/
  }
}
