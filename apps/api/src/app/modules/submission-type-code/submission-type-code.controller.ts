import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { CodeTableController } from '@controllers';
import { SubmissionTypeCodeService } from './submission-type-code.service';
import { SubmissionTypeCode } from './entities/submission-type-code.entity';

@ApiTags('submission-type-code')
@Controller('submission-type-code')
export class SubmissionTypeCodeController extends CodeTableController<SubmissionTypeCode> {
  constructor(protected readonly service: SubmissionTypeCodeService) {
    super(service);
  }

  @Get()
  @ApiResponse({ status: 200, type: [SubmissionTypeCode] })
  async findAll(): Promise<SubmissionTypeCode[]> {
    return super.findAll();
  }

}
