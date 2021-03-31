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
    protected readonly service: SubmissionService
  ) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: CreateSubmissionDto) {
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
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
