import { Controller, Post, Body} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { SubmissionService } from './submission.service';
import { SubmissionDto } from './dto/submission.dto';
import { UserRequiredHeader } from 'apps/api/src/core/security/auth.service';
import { User } from 'apps/api/src/core/security/user';

// Don't need all the normal CRUD operations accessible via API so don't extend BaseController.
@ApiTags('submission')
@Controller('submission')
export class SubmissionController {
 
  constructor(readonly service: SubmissionService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: SubmissionDto })
  @ApiResponse({ status: 201 })
  async processSpatialSubmission(
    @UserRequiredHeader() user: User,
    @Body() dto: SubmissionDto) {
    this.service.processSpatialSubmission(dto, user);
  }

}
