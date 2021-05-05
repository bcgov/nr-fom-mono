import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseController, BaseCollectionController } from '@controllers';
import { PublicCommentService } from './public-comment.service';
import { PublicComment } from './entities/public-comment.entity';
import { PublicCommentDto } from './dto/public-comment.dto';
import { UpdatePublicCommentDto } from './dto/update-public-comment.dto';
import { UpdateResult } from 'typeorm';

@ApiTags('public-comment')
@Controller('public-comment')
export class PublicCommentController extends BaseController<
  PublicComment,
  PublicCommentDto,
  UpdatePublicCommentDto
> {
  constructor(protected readonly service: PublicCommentService) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: PublicCommentDto): Promise<PublicCommentDto> {
    return super.create(createDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [PublicCommentDto] })
  async find(@Query('projectId') projectId: number): Promise<PublicCommentDto[]> {
    return super.findAll({ where: { project_id: projectId } });
  }

  // TODO: REMOVE
  @Get('/byProjectId/:id')
  async findByProjectId(@Param('id') id: number): Promise<PublicCommentDto[]> {
    return super.findAll({ where: { project_id: id } });
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PublicCommentDto> {
    return super.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdatePublicCommentDto
  ): Promise<UpdatePublicCommentDto> {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<UpdateResult> {
    return super.remove(id);
  }
}
