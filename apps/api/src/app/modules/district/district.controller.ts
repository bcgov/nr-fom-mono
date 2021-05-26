import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseReadOnlyController } from '@controllers';
import { DistrictService } from './district.service';
import { District } from './district.entity';
import { DistrictResponse } from './district.dto';

@ApiTags('district')
@Controller('district')
export class DistrictController extends BaseReadOnlyController<District, DistrictResponse> {
  constructor(protected readonly service: DistrictService) {
    super(service);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [DistrictResponse] })
  async findAll(): Promise<DistrictResponse[]> {
    return super.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: DistrictResponse })
  async findOne(@Param('id') id: number): Promise<DistrictResponse> {
    return super.findOne(id);
  }
}
