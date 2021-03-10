import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { FspDistrictXrefService } from './fsp-district-xref.service';
import { FspDistrictXref } from './entities/fsp-district-xref.entity';
import { CreateFspDistrictXrefDto } from './dto/create-fsp-district-xref.dto';
import { UpdateFspDistrictXrefDto } from './dto/update-fsp-district-xref.dto';

@ApiTags('fsp-district-xref')
@Controller('fsp-district-xref')
export class FspDistrictXrefController extends BaseController<
  FspDistrictXref,
  CreateFspDistrictXrefDto,
  UpdateFspDistrictXrefDto
> {
  constructor(protected readonly service: FspDistrictXrefService) {
    super(service);
  }

  @Post()
  create(@Body() createDto: CreateFspDistrictXrefDto) {
    return super.create(createDto);
  }

  @Get()
  findAll() {
    return super.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateFspDistrictXrefDto) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
