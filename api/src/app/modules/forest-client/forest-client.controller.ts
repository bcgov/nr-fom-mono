import { Controller, Get, HttpStatus, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseReadOnlyController } from '@controllers';
import { User } from "@utility/security/user";
import { ForestClientResponse } from './forest-client.dto';
import { ForestClient } from './forest-client.entity';
import { ForestClientService } from './forest-client.service';
import { AuthGuard, AuthGuardMeta, GUARD_OPTIONS, UserHeader } from '@api-core/security/auth.guard';

@ApiTags('forest-client')
@UseGuards(AuthGuard)
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
    @UserHeader() user: User,
  ): Promise<ForestClientResponse[]> {
    return this.service.find(user.clientIds);
  }

  @Get(':id')
  @AuthGuardMeta(GUARD_OPTIONS.PUBLIC)
  @ApiResponse({ status: HttpStatus.OK, type: ForestClientResponse })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ForestClientResponse> {
    console.log("Forest Client findOne: ", id)
    return super.findOne(id);
  }
}
