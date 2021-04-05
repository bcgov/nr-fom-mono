import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';

import { BaseController, BaseCollectionController } from '@controllers';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController extends BaseCollectionController<
  Project,
  CreateProjectDto,
  UpdateProjectDto
> {
  constructor(protected readonly service: ProjectService) {
    super(service);
  }

  @Get('/byFspId/:id')
  async findByFspId(@Param('id') id: number) {
    return super.findAll({
      where: { fsp_id: id },
      relations: ['district', 'forest_client', 'workflow_state'],
    });
  }

  @Post()
  async findAll(@Body() options) {
    return super.findAll(options);
  }
}

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

  @Post()
  async create(@Body() createDto: CreateProjectDto) {
    return super.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateProjectDto })
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateProjectDto
  ): Promise<UpdateProjectDto> {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
