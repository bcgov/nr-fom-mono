import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { UserHeader, UserRequiredHeader } from '@api-core/security/auth.service';
import { User } from "@utility/security/user";
import { PublicNoticeCreateRequest, PublicNoticePublicFrontEndResponse, PublicNoticeResponse, PublicNoticeUpdateRequest } from './public-notice.dto';
import { PublicNoticeService } from './public-notice.service';


@ApiTags('public-notice')
@Controller('public-notice')
export class PublicNoticeController {
  constructor(
    private readonly service: PublicNoticeService,
    private readonly logger: PinoLogger) {
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [PublicNoticePublicFrontEndResponse] })
  async findListForPublicFrontEnd(
    ): Promise<PublicNoticePublicFrontEndResponse[]> {

      return this.service.findForPublicFrontEnd();
  }

  // Find the last updated public notice for the same Forest Client.
  @Get('/latest/:forestClientId')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: PublicNoticeResponse })
  async findLatestPublicNotice(
    @UserHeader() user: User,
    @Param('forestClientId') forestClientId: string  
    ): Promise<PublicNoticeResponse> {
      return this.service.findLatestPublicNotice(forestClientId, user);
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
