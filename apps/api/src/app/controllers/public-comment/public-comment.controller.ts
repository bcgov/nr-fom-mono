import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { PublicCommentService } from './public-comment.service';
import { ProjectService } from '../project/project.service';
import { ResponseCodeService } from '../response-code/response-code.service';
import { PublicComment } from './entities/public-comment.entity';
import { CreatePublicCommentDto } from './dto/create-public-comment.dto';
import { UpdatePublicCommentDto } from './dto/update-public-comment.dto';
import { Project } from '../project/entities/project.entity';


@ApiTags('public-comment')
@Controller('public-comment')
export class PublicCommentController extends BaseController<
  PublicComment,
  CreatePublicCommentDto,
  UpdatePublicCommentDto
> {
  constructor(
    protected readonly service: PublicCommentService
  ) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: CreatePublicCommentDto) {
    return super.create(createDto);
  }

  @Get()
  async findAll(options) {
    return super.findAll(options);
  }

  @Get('/byProjectId/:id')
  async findByProjectId(@Param('id') id: number) {
    return super.findAll({ where: {projectId: id}});
  }


  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdatePublicCommentDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
