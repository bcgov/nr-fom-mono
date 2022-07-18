import { Controller, Get, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserRequiredHeader } from '@api-core/security/auth.service';
import { BaseReadOnlyController } from '@controllers';
import { User } from "@utility/security/user";
import { ForestClientResponse } from './forest-client.dto';
import { ForestClient } from './forest-client.entity';
import { ForestClientService } from './forest-client.service';

@ApiTags('forest-client')
@Controller('forest-client')
export class ForestClientController extends BaseReadOnlyController<
  ForestClient,
  ForestClientResponse
> {
  constructor(protected readonly service: ForestClientService) {
    super(service);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [ForestClientResponse], description: 'Returns only forest clients that the user is authorized for.' })
  async find(
    @UserRequiredHeader() user: User,
  ): Promise<ForestClientResponse[]> {
    return this.service.find(user.clientIds);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: ForestClientResponse })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ForestClientResponse> {
    return super.findOne(id);
  }
}
