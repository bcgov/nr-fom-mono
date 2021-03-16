import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { AttachmentService } from './attachment.service';
import { Attachment } from './entities/attachment.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@ApiTags('attachment')
@Controller('attachment')
export class AttachmentController extends BaseController<
  Attachment,
  CreateAttachmentDto,
  UpdateAttachmentDto
> {
  constructor(protected readonly service: AttachmentService) {
    super(service);
  }

  @Post()
  create(@Body() createDto: CreateAttachmentDto) {
    return super.create(createDto);
  }

  @Get()
  findAll(options) {
    return super.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateAttachmentDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
