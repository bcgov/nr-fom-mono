import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController, BaseCollectionController } from '@controllers';
import { FspDistrictXrefService } from './fsp-district-xref.service';
import { FspDistrictXref } from './entities/fsp-district-xref.entity';
import { FspDistrictXrefDto } from './dto/fsp-district-xref.dto';
import { UpdateFspDistrictXrefDto } from './dto/update-fsp-district-xref.dto';

@ApiTags('fsp-district-xrefs')
@Controller('fsp-district-xrefs')
export class FspDistrictXrefsController extends BaseCollectionController<
  FspDistrictXref,
  FspDistrictXrefDto,
  UpdateFspDistrictXrefDto
> {
  constructor(protected readonly service: FspDistrictXrefService) {
    super(service);
  }

  @Post()
  async findAll(@Body() options) {
    return super.findAll(options);
  }
}

@ApiTags('fsp-district-xref')
@Controller('fsp-district-xref')
export class FspDistrictXrefController extends BaseController<
  FspDistrictXref,
  FspDistrictXrefDto,
  UpdateFspDistrictXrefDto
> {
  constructor(protected readonly service: FspDistrictXrefService) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: FspDistrictXrefDto) {
    return super.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateFspDistrictXrefDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
