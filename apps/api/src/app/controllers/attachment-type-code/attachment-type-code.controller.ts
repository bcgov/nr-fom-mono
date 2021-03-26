import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CodeTableController } from '@controllers';
import { AttachmentTypeCodeService } from './attachment-type-code.service';
import { AttachmentTypeCode } from './entities/attachment-type-code.entity';
import { CreateAttachmentTypeCodeDto } from './dto/create-attachment-type-code.dto';
import { UpdateAttachmentTypeCodeDto } from './dto/update-attachment-type-code.dto';

@ApiTags('attachment-type-code')
@Controller('attachment-type-code')
export class AttachmentTypeCodeController extends CodeTableController<
  AttachmentTypeCode,
  CreateAttachmentTypeCodeDto,
  UpdateAttachmentTypeCodeDto
> {
  constructor(protected readonly service: AttachmentTypeCodeService) {
    super(service);
  }

  @Get()
  findAll() {
    return super.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

}
