import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { PublicCommentService } from './public-comment.service';
import { PublicComment } from './entities/public-comment.entity';
import { CreatePublicCommentDto } from './dto/create-public-comment.dto';
import { UpdatePublicCommentDto } from './dto/update-public-comment.dto';

@ApiTags('public-comment')
@Controller('public-comment')
export class PublicCommentController extends BaseController<
  PublicComment,
  CreatePublicCommentDto,
  UpdatePublicCommentDto
> {
  constructor(protected readonly service: PublicCommentService) {
    super(service);
  }

  @Post()
  create(@Body() createDto: CreatePublicCommentDto) {
    return super.create(createDto);
  }

  @Get()
  findAll(options) {
    return super.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdatePublicCommentDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
