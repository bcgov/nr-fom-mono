import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController, BaseCollectionController } from '@controllers';
import { SubmissionService } from './submission.service';
import { Submission } from './entities/submission.entity';
import { SubmissionDto } from './dto/submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { UpdateResult } from 'typeorm';
import { SubmissionWithJsonDto } from './dto/submission-with-json.dto';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController extends BaseCollectionController<
  Submission,
  SubmissionDto,
  UpdateSubmissionDto
> {
  constructor(protected readonly service: SubmissionService) {
    super(service);
  }

  @Post()
  async findAll(@Body() options) {
    return super.findAll(options);
  }
}

@ApiTags('submission')
@Controller('submission')
export class SubmissionController extends BaseController<
  Submission,
  SubmissionDto,
  UpdateSubmissionDto
> {
  constructor(protected readonly service: SubmissionService) {
    super(service);
  }

  @Post()
  async processSpatialSubmission(@Body() dto: SubmissionWithJsonDto) {
    return this.service.processSpatialSubmission(dto);
  }

  @Post()
  async create(@Body() createDto: SubmissionDto) {
    return super.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateSubmissionDto
  ) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
