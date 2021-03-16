import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { RoadSectionService } from './road-section.service';
import { RoadSection } from './entities/road-section.entity';
import { CreateRoadSectionDto } from './dto/create-road-section.dto';
import { UpdateRoadSectionDto } from './dto/update-road-section.dto';

@ApiTags('road-section')
@Controller('road-section')
export class RoadSectionController extends BaseController<
  RoadSection,
  CreateRoadSectionDto,
  UpdateRoadSectionDto
> {
  constructor(protected readonly service: RoadSectionService) {
    super(service);
  }

  @Post()
  create(@Body() createDto: CreateRoadSectionDto) {
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
  update(@Param('id') id: number, @Body() updateDto: UpdateRoadSectionDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
