import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController, BaseCollectionController } from '@controllers';
import { RoadSectionService } from './road-section.service';
import { RoadSection } from './entities/road-section.entity';
import { CreateRoadSectionDto } from './dto/create-road-section.dto';
import { UpdateRoadSectionDto } from './dto/update-road-section.dto';

@ApiTags('road-sections')
@Controller('road-sections')
export class RoadSectionsController extends BaseCollectionController<
  RoadSection,
  CreateRoadSectionDto,
  UpdateRoadSectionDto
> {
  constructor(protected readonly service: RoadSectionService) {
    super(service);
  }

  @Post()
  async findAll(@Body() options) {
    return super.findAll(options);
  }
}

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
  async create(@Body() createDto: CreateRoadSectionDto) {
    return super.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateRoadSectionDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
