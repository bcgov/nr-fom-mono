import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ProjectSpatialDetail } from './project-spatial-detail.entity';

@Injectable()
export class ProjectSpatialDetailService {
  
  constructor(
    @InjectRepository(ProjectSpatialDetail)
    private repository: Repository<ProjectSpatialDetail>,
    private logger: PinoLogger) {
    
    logger.setContext(this.constructor.name);
  }

// Because this is based on a view designed to provide an API response, no separate DTO object is used - the entity is returned directly.
async findByProjectId(projectId: number): Promise<ProjectSpatialDetail[]> {
    this.logger.debug(`${this.constructor.name}.findByProjectId id = ` + projectId);

    const findAll = await this.repository.find({
      where: { projectId: projectId },
      relations: ['submissionType'],
    });

    return findAll.map((item) => {
      var geojsonObj = JSON.parse(<string>item.geometry );
      item.geometry = geojsonObj;
      return item;
    });
  }

}
