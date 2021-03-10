import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../core/controllers/base.controller';
import { SubmissionService } from './submission.service';
import { Submission } from './entities/submission.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@ApiTags('submission')
@Controller('submission')
export class SubmissionController extends BaseController<
  Submission,
  CreateSubmissionDto,
  UpdateSubmissionDto
> {
  constructor(protected readonly service: SubmissionService) {
    super(service);
  }

  @Post()
  create(@Body() createDto: CreateSubmissionDto) {
    return super.create(createDto);
  }

  @Get()
  findAll() {
    return super.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateSubmissionDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
