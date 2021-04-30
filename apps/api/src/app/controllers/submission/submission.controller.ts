import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

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

// Don't need all the normal CRUD operations accessible via API so don't extend BaseController.
@ApiTags('submission')
@Controller('submission')
export class SubmissionController {
 
  constructor(readonly service: SubmissionService) {}

  // TODO: need to figure out return type, if any.
  @Post()
  @ApiBody({ type: SubmissionWithJsonDto })
  @ApiResponse({ status: 200 })
  async processSpatialSubmission(@Body() dto: SubmissionWithJsonDto) {
    return this.service.processSpatialSubmission(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

}
