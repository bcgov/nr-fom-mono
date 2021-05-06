import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsUtils, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { PinoLogger } from 'nestjs-pino';
import { ProjectPublicSummaryDto } from './dto/project-public.dto.';
import { WorkflowStateCode } from '../workflow-state-code/entities/workflow-state-code.entity';
import * as dayjs from 'dayjs';


export class ProjectFindCriteria {
  includeWorkflowStateCodes: string[] = [];
  likeForestClientName?: string;
  commentingOpenedOnOrAfter?: string; // format YYYY-MM-DD
  fspId?: number;
}

@Injectable()
export class ProjectService extends DataService<Project, Repository<Project>> {
  constructor(
    @InjectRepository(Project)
    repository: Repository<Project>,
    logger: PinoLogger
  ) {
    super(repository, new Project(), logger);
  }


  async findPublicSummaries(findCriteria: ProjectFindCriteria):Promise<ProjectPublicSummaryDto[]> {

    this.logger.info(`Find public summaries criteria: ${JSON.stringify(findCriteria)}`);

    try {
      const query = this.repository.createQueryBuilder("p")
        // .relation('workflowState', 'forestClient')
        // .leftJoinAndSelect('p.workflowState', 'workflowState')
        // .leftJoin('workflow_state', 'workflow_state')
        // .leftJoinAndSelect('forest_client', 'forest_client')
        // .where("user.name = :name", { name: "Timber" })
        .leftJoinAndSelect("p.forest_client", "forest_client")
        .leftJoinAndSelect("p.workflow_state", "workflow_state")
        // .andWhere("p.workflow_state_code not in ('EXPIRED')")
        // .andWhere("p.commenting_open_date >= :openDate", { openDate: '2020-01-01'})
        // .where("user.name IN (:...names)", { names: [ "Timber", "Cristal", "Lina" ] })
        // .take(5000) // Limit number of results. TODO: display warning on public front-end if limit reached.
        .limit(5000) // Cannot use take() with orderBy, get weird error. TODO: display warning on public front-end if limit reached.
        .addOrderBy('p.project_id', 'DESC');
        ;
      if (findCriteria.includeWorkflowStateCodes && findCriteria.includeWorkflowStateCodes.length > 0) {
        query.andWhere("p.workflow_state_code IN (:...workflowStateCodes)", { workflowStateCodes: findCriteria.includeWorkflowStateCodes});
      }
      if (findCriteria.likeForestClientName) {
        query.andWhere("forest_client.name like :forestClientName", { forestClientName:`%${findCriteria.likeForestClientName}%`});
      }
      if (findCriteria.commentingOpenedOnOrAfter) {
        query.andWhere("p.commenting_open_date >= :openDate", {openDate: `${findCriteria.commentingOpenedOnOrAfter}`});
      }

      // TODO: Clean up.
      console.log(query.getQuery());

      const result:Project[] = await query.getMany();

      return result.map(project => {
        var summary = new ProjectPublicSummaryDto();
        summary.id = project.id;
        summary.name = project.name;
        summary.workflowStateName = project.workflow_state.description;
        summary.forestClientName = project.forest_client.name;
        summary.geojson = project.geojson;
        summary.commentingOpenDate = dayjs(project.commenting_open_date).format('YYYY-MM-DD');
        return summary;
      });
    } catch (error) {
      this.logger.error(`${this.constructor.name}.findPublicSummaries ${error}`);
      throw new HttpException(
        'InternalServerErrorException',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
