import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { CodeTableController } from '@controllers';
import { SubmissionTypeCodeService } from './submission-type-code.service';
import { SubmissionTypeCode } from './entities/submission-type-code.entity';
import { SubmissionTypeCodeDto } from './dto/submission-type-code.dto';
import { UpdateSubmissionTypeCodeDto } from './dto/update-submission-type-code.dto';

@ApiTags('submission-type-code')
@Controller('submission-type-code')
export class SubmissionTypeCodeController extends CodeTableController<
  SubmissionTypeCode,
  SubmissionTypeCodeDto,
  UpdateSubmissionTypeCodeDto
> {
  constructor(protected readonly service: SubmissionTypeCodeService) {
    super(service);
  }

  @Get()
  @ApiResponse({ status: 200, type: [SubmissionTypeCodeDto] })
  async findAll(): Promise<SubmissionTypeCodeDto[]> {
    return super.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: SubmissionTypeCodeDto })
  async findOne(@Param('id') id: string): Promise<SubmissionTypeCodeDto> {
    return super.findOne(id);
  }
}
