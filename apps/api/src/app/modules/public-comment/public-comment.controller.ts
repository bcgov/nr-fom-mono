import { Controller, Get, Post, Put, Body, Param, Query, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PublicCommentService } from './public-comment.service';
import { PublicCommentAdminResponse, PublicCommentAdminUpdateRequest, PublicCommentCreateRequest } from './dto/public-comment-new.dto';
import { UserRequiredHeader } from 'apps/api/src/core/security/auth.service';
import { User } from 'apps/api/src/core/security/user';
import { PublicCommentDto } from './dto/public-comment.dto';

@ApiTags('public-comment')
@Controller('public-comment')
export class PublicCommentController {

  constructor(private service: PublicCommentService) {
  }

  // Anonymous users can create comments.
  @Post()
  @ApiResponse({ status: HttpStatus.CREATED })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // TODO: Look at making these global properties.
  async create(
    @Body() request: PublicCommentCreateRequest): Promise<void> {
     await this.service.create(request, null); 
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: PublicCommentAdminResponse })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // TODO: Look at making these global properties.
  async update(
    @UserRequiredHeader() user: User,
    @Param('id') id: number,
    @Body() updateDto: PublicCommentAdminUpdateRequest
  ): Promise<PublicCommentAdminResponse> {
    return this.service.update(id, updateDto, user);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [PublicCommentAdminResponse] })
  async find(
    @UserRequiredHeader() user: User,
    @Query('projectId') projectId: number): Promise<PublicCommentAdminResponse[]> {
    return this.service.findAll(user, { 
      where: { projectId: projectId }, 
      relations: ['commentScope', 'response'],
    });
  }

  // TODO: REMOVE this once Admin component is changed.
  @Get('/byProjectId/:id')
  @ApiBearerAuth()
  async findByProjectId(
    @UserRequiredHeader() user: User,
    @Param('id') id: number): Promise<PublicCommentDto[]> {
    return this.service.findAll(user, { where: { projectId: id } });
  }

  // TODO: Unsure if this is needed...
  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: PublicCommentAdminResponse })
  async findOne(
    @UserRequiredHeader() user: User,
    @Param('id') id: number): Promise<PublicCommentAdminResponse> {
    return this.service.findOne(id, user);
  }

}
