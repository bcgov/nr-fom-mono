import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async findByProjectId(project_id: number): Promise<ProjectSpatialDetail[]> {
    this.logger.info(`${this.constructor.name}.findByProjectId id = ` + project_id);

    try {

      const findAll = await this.repository.find({
        where: { project_id: project_id },
        relations: ['submission_type'],
      });

      return findAll.map((item) => {
        var geojsonObj = JSON.parse(<string>item.geometry );
        item.geometry = geojsonObj;
        return item;
      });
    } catch (error) {
      this.logger.error(`${this.constructor.name}.findAll ${error}`);
      throw new HttpException(
        'InternalServerErrorException',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}
