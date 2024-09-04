import { FomFspTrackerResponse } from "@api-modules/external/fsp-tracker/fsp-tracker.dto";
import { Project } from "@api-modules/project/project.entity";
import { DataService } from "@core";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ForestClientService } from "@src/app/modules/forest-client/forest-client.service";
import { ProjectFindCriteria } from "@src/app/modules/project/project.service";
import { User } from "@utility/security/user";
import { PinoLogger } from "nestjs-pino";
import { Repository } from "typeorm";

@Injectable()
export class FspTrackerService extends DataService<Project, Repository<Project>, FomFspTrackerResponse> {

  constructor(
    @InjectRepository(Project)
    repository: Repository<Project>,
    private forestClientService: ForestClientService,
    logger: PinoLogger
  ) {
    super(repository, new Project(), logger);
  }

  async isViewAuthorized(_entity: Project, _user?: User): Promise<boolean> {
    return true;
  }

  async find(findCriteria: ProjectFindCriteria):Promise<FomFspTrackerResponse[]> {
    this.logger.debug('Find criteria: %o', findCriteria);

    const query = this.repository.createQueryBuilder("p")
      .leftJoinAndSelect("p.forestClient", "forestClient")
      .addOrderBy('p.project_id', 'DESC');
    findCriteria.applyFindCriteria(query);
    query.limit(2500); // Can't use take(). Limit # of results to avoid system strain.

    const queryResults:Project[] = await query.getMany();
    if (queryResults && queryResults.length > 0) {
      this.logger.debug(`${queryResults.length} project(s) found.`);
      return queryResults.map(project => this.convertEntity(project));
    }
    this.logger.debug('No result found.');
    return [];
  }

  convertEntity(entity: Project): FomFspTrackerResponse {
    const response = new FomFspTrackerResponse();
    response.fomId = entity.id
    response.name = entity.name
    response.fspId = entity.fspId;
    if (entity.forestClient != null) {
      response.forestClient = this.forestClientService.convertEntity(entity.forestClient);
    }    
    return response;
  }

}