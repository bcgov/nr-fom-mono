import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { PublicCommentService } from './public-comment.service';
import { ProjectService } from '../project/project.service';
import { ResponseCodeService } from '../response-code/response-code.service';
import { PublicComment } from './entities/public-comment.entity';
import { CreatePublicCommentDto } from './dto/create-public-comment.dto';
import { UpdatePublicCommentDto } from './dto/update-public-comment.dto';
import { Project } from '../project/entities/project.entity';


@ApiTags('public-comment')
@Controller('public-comment')
export class PublicCommentController extends BaseController<
  PublicComment,
  CreatePublicCommentDto,
  UpdatePublicCommentDto
> {
  constructor(
    protected readonly service: PublicCommentService,
    protected readonly projectService: ProjectService,
    protected readonly responseCodeService: ResponseCodeService
  ) {
    super(service);
  }

  async mapEntitiesFromIds(dto): Promise<CreatePublicCommentDto> {
    if (dto.projectId) {
      const project: Project = await this.projectService.findOne(dto.projectId);
      dto.project = project;
    }

    if (dto.responseCode) {
      const response: Project = await this.projectService.findOne(dto.responseCode);
      dto.response = response;
    }

    return dto;
  }

  @Post()
  async create(@Body() createDto: CreatePublicCommentDto) {
    createDto = await this.mapEntitiesFromIds(createDto);
    return super.create(createDto);
  }

  @Get()
  async findAll(options) {
    return super.findAll(options);
  }

  @Get('/byProjectId/:id')
  async findByProjectId(@Param('id') id: number) {
    return super.findAll({ where: {projectId: id}});
  }


  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdatePublicCommentDto) {
    updateDto = await this.mapEntitiesFromIds(updateDto);
    const result = await super.update(id, updateDto);
    result.projectId = result.project.id;
    result.responseCode = result.response.code;
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
