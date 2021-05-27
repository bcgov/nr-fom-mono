import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { AttachmentService } from './attachment.service';
import { Attachment } from './attachment.entity';
import { AttachmentDto } from './attachment.dto';
import { UserHeader } from 'apps/api/src/core/security/auth.service';
import { User } from 'apps/api/src/core/security/user';

@ApiTags('attachment')
@Controller('attachment')
export class AttachmentController extends BaseController<Attachment> {
  
  constructor(protected readonly service: AttachmentService) {
    super(service);
  }

  // Accessible by public and by authenticated users.
  @Get(':id')
  @ApiBearerAuth()
  async findOne(
    @UserHeader() user: User,
    @Param('id') id: number) {
    return this.service.findOne(id, user);
  }

/*  
  @Post()
  async create(@Body() createDto: AttachmentDto) {
    return this.service.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateAttachmentDto
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
*/
}
