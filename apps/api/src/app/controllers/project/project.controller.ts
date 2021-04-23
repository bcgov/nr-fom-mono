import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

import { BaseController, BaseCollectionController } from '@controllers';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { ProjectDto } from './dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateResult } from 'typeorm';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController extends BaseCollectionController<
  Project,
  ProjectDto,
  UpdateProjectDto
> {
  constructor(protected readonly service: ProjectService) {
    super(service);
  }

  @Get('/byFspId/:id')
  @ApiResponse({ status: 200, type: [ProjectDto] })
  async findByFspId(@Param('id') id: number): Promise<ProjectDto[]> {
    return super.findAll({
      where: { fsp_id: id },
      relations: ['district', 'forest_client', 'workflow_state'],
    });
  }

  @Post()
  @ApiResponse({ status: 200, type: [ProjectDto] })
  async findAll(@Body() options = {}): Promise<ProjectDto[]> {
    return super.findAll(options);
  }
}

@ApiTags('project')
@Controller('project')
export class ProjectController extends BaseController<
  Project,
  ProjectDto,
  UpdateProjectDto
> {
  constructor(protected readonly service: ProjectService) {
    super(service);
  }

  @Post()
  @ApiResponse({ status: 201, type: ProjectDto })
  async create(@Body() createDto: ProjectDto): Promise<ProjectDto> {
    // add buisiness logic here
    return super.create(createDto);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ProjectDto })
  async findOne(@Param('id') id: number): Promise<ProjectDto> {
    return super.findOne(id, {
      relations: ['district', 'forest_client', 'workflow_state'],
    });
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: UpdateProjectDto })
  @ApiBody({ type: UpdateProjectDto })
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateProjectDto
  ): Promise<UpdateProjectDto> {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: UpdateResult })
  async remove(@Param('id') id: number): Promise<UpdateResult> {
    return super.remove(id);
  }
}
