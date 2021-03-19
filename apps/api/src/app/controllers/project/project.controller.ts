import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';

import { BaseController } from '@controllers';
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

  @Post()
  create(@Body() createDto: CreateProjectDto) {
    return super.create(createDto);
  }

  @Get('/byFspId/:id')
  findByFspId(@Param('id') id: number) {
    // Don't need to specify loading of workflowStateCode because it is eager loaded.
    // return super.findAll({ where: {fspId: id}, relations: ["workflowStateCode"] });
    return super.findAll({ where: {fspId: id}});
  }

  @Get()
  findAll(options) {
    return super.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateProjectDto })
  update(@Param('id') id: number, @Body() updateDto: UpdateProjectDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
