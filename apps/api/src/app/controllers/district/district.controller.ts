import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseReadOnlyController } from '@controllers';
import { DistrictService } from './district.service';
import { District } from './entities/district.entity';
import { DistrictDto } from './dto/district.dto';

@ApiTags('district')
@Controller('district')
export class DistrictController extends BaseReadOnlyController<
  District,
  DistrictDto
> {
  constructor(protected readonly service: DistrictService) {
    super(service);
  }

  @Get()
  @ApiResponse({ status: 200, type: [DistrictDto] })
  async findAll(): Promise<DistrictDto[]> {
    return super.findAll();
  }

  @Get()
  @ApiResponse({ status: 200, type: DistrictDto })
  async findOne(@Param('id') id: number): Promise<DistrictDto> {
    return super.findOne(id);
  }
}
