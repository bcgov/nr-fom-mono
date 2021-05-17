import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { AttachmentService } from './attachment.service';
import { Attachment } from './entities/attachment.entity';
import { AttachmentDto } from './dto/attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@ApiTags('attachment')
@Controller('attachment')
export class AttachmentController extends BaseController<
  Attachment,
  AttachmentDto,
  UpdateAttachmentDto
> {
  constructor(protected readonly service: AttachmentService) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: AttachmentDto) {
    return super.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateAttachmentDto
  ) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
