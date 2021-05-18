import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseReadOnlyController } from '@controllers';
import { ForestClientService } from './forest-client.service';
import { ForestClient } from './entities/forest-client.entity';
import { ForestClientDto } from './dto/forest-client.dto';
import { UserHeader } from 'apps/api/src/core/security/auth.service';
import { User } from 'apps/api/src/core/security/user';

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
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: [ForestClientDto], description: 'Returns only forest clients that the user is authorized for.' })
  async find(
    @UserHeader() user: User,
  ): Promise<ForestClientDto[]> {
    return this.service.find(user.clientIds);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ForestClientDto })
  async findOne(@Param('id') id: number): Promise<ForestClientDto> {
    return super.findOne(id);
  }
}
