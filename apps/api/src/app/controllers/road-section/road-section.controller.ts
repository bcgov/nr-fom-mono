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
import { RoadSectionService } from './road-section.service';
import { RoadSection } from './entities/road-section.entity';
import { RoadSectionDto } from './dto/road-section.dto';
import { UpdateRoadSectionDto } from './dto/update-road-section.dto';

@ApiTags('road-sections')
@Controller('road-sections')
export class RoadSectionsController extends BaseCollectionController<
  RoadSection,
  RoadSectionDto,
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
  RoadSectionDto,
  UpdateRoadSectionDto
> {
  constructor(protected readonly service: RoadSectionService) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: RoadSectionDto) {
    return super.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateRoadSectionDto
  ) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
