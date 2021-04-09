import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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
  async findAll() {
    return super.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }
}
