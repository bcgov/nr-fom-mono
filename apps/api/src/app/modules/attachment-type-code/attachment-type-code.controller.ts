import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { CodeTableController } from '@controllers';
import { AttachmentTypeCodeService } from './attachment-type-code.service';
import { AttachmentTypeCode } from './entities/attachment-type-code.entity';

@ApiTags('attachment-type-code')
@Controller('attachment-type-code')
export class AttachmentTypeCodeController extends CodeTableController<AttachmentTypeCode> {
  constructor(protected readonly service: AttachmentTypeCodeService) {
    super(service);
  }

  @Get()
  @ApiResponse({ status: 200, type: [AttachmentTypeCode] })
  async findAll(): Promise<AttachmentTypeCode[]> {
    return super.findAll();
  }

}
