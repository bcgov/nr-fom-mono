import { Controller, Get, HttpStatus, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard, AuthGuardMeta, GUARD_OPTIONS, UserHeader } from '@api-core/security/auth.guard';
import { User } from "@utility/security/user";
import { ForestClientResponse } from './forest-client.dto';
import { ForestClientService } from './forest-client.service';

@ApiTags('forest-client')
@UseGuards(AuthGuard)
@Controller('forest-client')
export class ForestClientController{
  constructor(protected readonly service: ForestClientService) {
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
    return this.service.findOne(id);
  }
}
