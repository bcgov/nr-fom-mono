import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseReadOnlyController } from '@controllers';
import { ForestClientService } from './forest-client.service';
import { ForestClient } from './entities/forest-client.entity';
import { ForestClientDto } from './dto/forest-client.dto';

@ApiTags('forest-client')
@Controller('forest-client')
export class ForestClientController extends BaseReadOnlyController<
  ForestClient,
  ForestClientDto
> {
  constructor(protected readonly service: ForestClientService) {
    super(service);
  }

  @Get()
  @ApiResponse({ status: 200, type: [ForestClientDto] })
  async findAll(): Promise<ForestClientDto[]> {
    return super.findAll();
  }

  @Get()
  @ApiResponse({ status: 200, type: ForestClientDto })
  async findOne(@Param('id') id: number): Promise<ForestClientDto> {
    return super.findOne(id);
  }
}
