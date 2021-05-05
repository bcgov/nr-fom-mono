import { Controller, Get, Post, Body} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

import { SubmissionService } from './submission.service';
import { SubmissionDto } from './dto/submission.dto';

// Don't need all the normal CRUD operations accessible via API so don't extend BaseController.
@ApiTags('submission')
@Controller('submission')
export class SubmissionController {
 
  constructor(readonly service: SubmissionService) {}

  // TODO: need to figure out return type, if any.
  @Post()
  @ApiBody({ type: SubmissionDto })
  @ApiResponse({ status: 201 })
  async processSpatialSubmission(@Body() dto: SubmissionDto) {
    return this.service.processSpatialSubmission(dto);
  }

}
