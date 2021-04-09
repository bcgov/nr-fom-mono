import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController, BaseCollectionController } from '@controllers';
import { PublicCommentService } from './public-comment.service';
import { PublicComment } from './entities/public-comment.entity';
import { PublicCommentDto } from './dto/public-comment.dto';
import { UpdatePublicCommentDto } from './dto/update-public-comment.dto';

@ApiTags('public-comments')
@Controller('public-comments')
export class PublicCommentsController extends BaseCollectionController<
  PublicComment,
  PublicCommentDto,
  UpdatePublicCommentDto
> {
  constructor(protected readonly service: PublicCommentService) {
    super(service);
  }

  @Post()
  async findAll(@Body() options) {
    return super.findAll(options);
  }

  @Get('/byProjectId/:id')
  async findByProjectId(@Param('id') id: number) {
    return super.findAll({ where: { project_id: id } });
  }
}

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
  async create(@Body() createDto: PublicCommentDto) {
    return super.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdatePublicCommentDto
  ) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
