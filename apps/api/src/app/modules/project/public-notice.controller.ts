import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, ParseIntPipe  } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { PublicNoticeService } from './public-notice.service';
import { PublicNoticeCreateRequest, PublicNoticeUpdateRequest, PublicNoticeResponse, PublicNoticePublicFrontEndResponse } from './public-notice.dto';
import { UserHeader, UserRequiredHeader } from '@api-core/security/auth.service';
import { User } from "@api-core/security/user";


@ApiTags('public-notice')
@Controller('public-notice')
export class PublicNoticeController {
  constructor(
    private readonly service: PublicNoticeService,
    private readonly logger: PinoLogger) {
  }

  // TODO: Maybe change URL path?
  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [PublicNoticePublicFrontEndResponse] })
  async findListForPublicFrontEnd(
    ): Promise<PublicNoticePublicFrontEndResponse[]> {

      return this.service.findForPublicFrontEnd();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: PublicNoticeResponse })
  async findOne(
    @UserHeader() user: User,
    @Param('id', ParseIntPipe) id: number): Promise<PublicNoticeResponse> {
    return this.service.findOne(id, user);
  }
  
  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: PublicNoticeResponse })
  async create(
    @UserRequiredHeader() user: User,
    @Body() request: PublicNoticeCreateRequest
    ): Promise<PublicNoticeResponse> {
    return this.service.create(request, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: PublicNoticeResponse })
  @ApiBody({ type: PublicNoticeUpdateRequest })
  async update(
    @UserRequiredHeader() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() request: PublicNoticeUpdateRequest
  ): Promise<PublicNoticeResponse> {
    return this.service.update(id, request, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  async remove(
    @UserRequiredHeader() user: User,
    @Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id, user);
  }

}
