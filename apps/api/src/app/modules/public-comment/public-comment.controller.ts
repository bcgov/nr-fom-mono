import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { PublicCommentService } from './public-comment.service';
import { PublicComment } from './entities/public-comment.entity';
import { PublicCommentDto } from './dto/public-comment.dto';
import { UpdatePublicCommentDto } from './dto/update-public-comment.dto';
import { UserRequiredHeader } from 'apps/api/src/core/security/auth.service';
import { User } from 'apps/api/src/core/security/user';

@ApiTags('public-comment')
@Controller('public-comment')
export class PublicCommentController extends BaseController<PublicComment> {

  constructor(protected readonly service: PublicCommentService) {
    super(service);
  }

  // Anonymous users can create comments.
  @Post()
  async create(
    @Body() createDto: PublicCommentDto): Promise<void> {
    this.service.create(createDto, null); 
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [PublicCommentDto] })
  async find(
    @UserRequiredHeader() user: User,
    @Query('projectId') projectId: number): Promise<PublicCommentDto[]> {
    return this.service.findAll(user, { where: { projectId: projectId } });
  }

  // TODO: REMOVE this once Admin component is changed.
  @Get('/byProjectId/:id')
  @ApiBearerAuth()
  async findByProjectId(
    @UserRequiredHeader() user: User,
    @Param('id') id: number): Promise<PublicCommentDto[]> {
      return this.service.findByProjectId(user, id);
  }

  @Get(':id')
  @ApiBearerAuth()
  async findOne(
    @UserRequiredHeader() user: User,
    @Param('id') id: number): Promise<PublicCommentDto> {
    return this.service.findOne(id, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  async update(
    @UserRequiredHeader() user: User,
    @Param('id') id: number,
    @Body() updateDto: UpdatePublicCommentDto
  ): Promise<UpdatePublicCommentDto> {
    return this.service.update(id, updateDto, user);
  }

}
