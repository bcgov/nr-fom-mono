import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { RetentionAreaService } from './retention-area.service';
import { RetentionArea } from './entities/retention-area.entity';
import { CreateRetentionAreaDto } from './dto/create-retention-area.dto';
import { UpdateRetentionAreaDto } from './dto/update-retention-area.dto';

@ApiTags('retention-area')
@Controller('retention-area')
export class RetentionAreaController extends BaseController<
  RetentionArea,
  CreateRetentionAreaDto,
  UpdateRetentionAreaDto
> {
  constructor(protected readonly service: RetentionAreaService) {
    super(service);
  }

  @Post()
  create(@Body() createDto: CreateRetentionAreaDto) {
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
  update(@Param('id') id: number, @Body() updateDto: UpdateRetentionAreaDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
