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
import { RetentionAreaService } from './retention-area.service';
import { RetentionArea } from './entities/retention-area.entity';
import { CreateRetentionAreaDto } from './dto/create-retention-area.dto';
import { UpdateRetentionAreaDto } from './dto/update-retention-area.dto';

@ApiTags('retention-areas')
@Controller('retention-areas')
export class RetentionAreasController extends BaseCollectionController<
  RetentionArea,
  CreateRetentionAreaDto,
  UpdateRetentionAreaDto
> {
  constructor(protected readonly service: RetentionAreaService) {
    super(service);
  }

  @Post()
  async findAll(@Body() options) {
    return super.findAll(options);
  }
}

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
  async create(@Body() createDto: CreateRetentionAreaDto) {
    return super.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateRetentionAreaDto
  ) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
