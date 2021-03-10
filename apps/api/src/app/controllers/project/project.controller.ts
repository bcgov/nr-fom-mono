import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../core/controllers/base.controller';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('project')
@Controller('project')
export class ProjectController extends BaseController<
  Project,
  CreateProjectDto,
  UpdateProjectDto
> {
  constructor(protected readonly service: ProjectService) {
    super(service);
  }
}
