import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { CutBlockService } from './cut-block.service';
import { CutBlock } from './entities/cut-block.entity';
import { CreateCutBlockDto } from './dto/create-cut-block.dto';
import { UpdateCutBlockDto } from './dto/update-cut-block.dto';

@ApiTags('cut-block')
@Controller('cut-block')
export class CutBlockController extends BaseController<
  CutBlock,
  CreateCutBlockDto,
  UpdateCutBlockDto
> {
  constructor(protected readonly service: CutBlockService) {
    super(service);
  }

  @Post()
  create(@Body() createDto: CreateCutBlockDto) {
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
  update(@Param('id') id: number, @Body() updateDto: UpdateCutBlockDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
