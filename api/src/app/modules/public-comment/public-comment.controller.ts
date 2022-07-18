import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserRequiredHeader } from '@api-core/security/auth.service';
import { User } from "@utility/security/user";
import { PinoLogger } from 'nestjs-pino';
import { PublicCommentAdminResponse, PublicCommentAdminUpdateRequest, PublicCommentCreateRequest } from './public-comment.dto';
import { PublicCommentService } from './public-comment.service';

@ApiTags('public-comment')
@Controller('public-comment')
export class PublicCommentController {

  constructor(
    private service: PublicCommentService, 
    private logger: PinoLogger) {
  }

  // Anonymous users can create comments.
  @Post()
  @ApiResponse({ status: HttpStatus.CREATED })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Explicitly reject requests with extra attributes.
  async create(
    @Body() request: PublicCommentCreateRequest): Promise<void> {
      // Due to limited budget we are not performing additional validation that the request makes sense (e.g. if scope not overall, valid feature has been selected).
      await this.service.create(request, null); 
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: PublicCommentAdminResponse })
  async update(
    @UserRequiredHeader() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: PublicCommentAdminUpdateRequest
  ): Promise<PublicCommentAdminResponse> {
    return this.service.update(id, updateDto, user);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [PublicCommentAdminResponse] })
  async find(
    @UserRequiredHeader() user: User,
    @Query('projectId', ParseIntPipe) projectId: number): Promise<PublicCommentAdminResponse[]> {
      return this.service.findByProjectId(projectId, user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: PublicCommentAdminResponse })
  async findOne(
    @UserRequiredHeader() user: User,
    @Param('id', ParseIntPipe) id: number): Promise<PublicCommentAdminResponse> {
    return this.service.findOne(id, user);
  }

}
