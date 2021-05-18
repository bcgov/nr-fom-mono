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


  // TODO: Disable because won't be performant - instead get a list of forest clients based on user's acccess.
  @Get()
  @ApiResponse({ status: 200, type: [ForestClientDto] })
  async findAll(): Promise<ForestClientDto[]> {
    return super.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ForestClientDto })
  async findOne(@Param('id') id: number): Promise<ForestClientDto> {
    return super.findOne(id);
  }
}
