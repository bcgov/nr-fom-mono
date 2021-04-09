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
import { CutBlockService } from './cut-block.service';
import { CutBlock } from './entities/cut-block.entity';
import { CutBlockDto } from './dto/cut-block.dto';
import { UpdateCutBlockDto } from './dto/update-cut-block.dto';

@ApiTags('cut-blocks')
@Controller('cut-blocks')
export class CutBlocksController extends BaseCollectionController<
  CutBlock,
  CutBlockDto,
  UpdateCutBlockDto
> {
  constructor(protected readonly service: CutBlockService) {
    super(service);
  }

  @Post()
  async findAll(@Body() options) {
    return super.findAll(options);
  }
}

@ApiTags('cut-block')
@Controller('cut-block')
export class CutBlockController extends BaseController<
  CutBlock,
  CutBlockDto,
  UpdateCutBlockDto
> {
  constructor(protected readonly service: CutBlockService) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: CutBlockDto) {
    return super.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateCutBlockDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
