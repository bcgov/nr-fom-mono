import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProjectService extends DataService<Project, Repository<Project>> {
  constructor(
    @InjectRepository(Project)
    repository: Repository<Project>,
    logger: PinoLogger
  ) {
    super(repository, new Project(), logger);
  }
}
