import { Controller, Post, Body, HttpStatus} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

import { SubmissionService } from './submission.service';
import { SubmissionRequest } from './submission.dto';
import { UserRequiredHeader } from 'apps/api/src/core/security/auth.service';
import { User } from 'apps/api/src/core/security/user';

@ApiTags('submission')
@Controller('submission')
export class SubmissionController {
 
  constructor(private readonly service: SubmissionService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: SubmissionRequest })
  @ApiResponse({ status: HttpStatus.OK })
  async processSpatialSubmission(
    @UserRequiredHeader() user: User,
    @Body() dto: SubmissionRequest) {
    await this.service.processSpatialSubmission(dto, user);
  }

}
