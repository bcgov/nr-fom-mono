import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ProjectSpatialDetail } from './entities/project-spatial-detail.entity';

@Injectable()
export class ProjectSpatialDetailService {
  
  constructor(
    @InjectRepository(ProjectSpatialDetail)
    private repository: Repository<ProjectSpatialDetail>,
    private logger: PinoLogger) {
    
    logger.setContext(this.constructor.name);
  }

  async findByProjectId(projectId: number): Promise<ProjectSpatialDetail[]> {
    this.logger.trace(`${this.constructor.name}.findByProjectId id = ` + projectId);

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
