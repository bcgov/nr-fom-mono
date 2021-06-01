import { Controller, Get, Post, Delete, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { AttachmentService } from './attachment.service';
import { Attachment } from './attachment.entity';
import { AttachmentCreateRequest, AttachmentResponse } from './attachment.dto';
import { UserHeader, UserRequiredHeader } from 'apps/api/src/core/security/auth.service';
import { User } from 'apps/api/src/core/security/user';

@ApiTags('attachment')
@Controller('attachment')
export class AttachmentController extends BaseController<Attachment> {
  
  constructor(protected readonly service: AttachmentService) {
    super(service);
  }

  // Accessible by public (if attachment type not interaction) and by authenticated users.
  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: AttachmentResponse})
  async findOne(
    @UserHeader() user: User,
    @Param('id') id: number) {
    return this.service.findOne(id, user);
  }

  @Get('/file/:id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK }) // TODO: Type
  async getFileContents(
    @UserHeader() user: User,
    @Param('id') id: number): Promise<string> {
    // return this.service.findOne(id, user);
    return null;
  }

  @Post()
  @ApiBearerAuth()
  async create(
    @UserRequiredHeader() user: User,
    @Body() createRequest: AttachmentCreateRequest ): Promise<AttachmentResponse> {
    return this.service.create(createRequest, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  async remove(
    @UserRequiredHeader() user: User,
    @Param('id') id: number) {
    return this.service.delete(id);
  }

}
