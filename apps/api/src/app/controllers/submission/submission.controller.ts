import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { SubmissionService } from './submission.service';
import { Submission } from './entities/submission.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

import { ProjectService } from '../project/project.service';
import { SubmissionTypeCodeService } from '../submission-type-code/submission-type-code.service';
import { Project } from '../project/entities/project.entity';
import { SubmissionTypeCode } from '../submission-type-code/entities/submission-type-code.entity';

@ApiTags('submission')
@Controller('submission')
export class SubmissionController extends BaseController<
  Submission,
  CreateSubmissionDto,
  UpdateSubmissionDto
> {
  constructor(
    protected readonly service: SubmissionService,
    protected readonly projectService: ProjectService,
    protected readonly submissionTypeCodeService: SubmissionTypeCodeService
  ) {
    super(service);
  }

  async mapEntitiesFromIds(dto): Promise<CreateSubmissionDto> {
    if (dto.projectId) {
      const project: Project = await this.projectService.findOne(dto.projectId);
      dto.project = project;
    }

    if (dto.submissionTypeCode) {
      const submissionType: SubmissionTypeCode = await this.submissionTypeCodeService.findOne(dto.projectId);
      dto.submissionType = submissionType;
    }

    return dto;
  }

  @Post()
  async create(@Body() createDto: CreateSubmissionDto) {
    createDto = await this.mapEntitiesFromIds(createDto);
    return super.create(createDto);
  }

  @Get()
  async findAll(options) {
    return super.findAll(options);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateSubmissionDto) {
    updateDto = await this.mapEntitiesFromIds(updateDto);
    const result = await super.update(id, updateDto);
    result.projectId = result.project.id;
    result.submissionTypeCode = result.submissionType.code;
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
