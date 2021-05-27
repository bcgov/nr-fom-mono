import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '@controllers';
import { InteractionService } from './interaction.service';
import { Interaction } from './interaction.entity';
import { InteractionDto } from './interaction.dto';

@ApiTags('interaction')
@Controller('interaction')
export class InteractionController extends BaseController<Interaction> {

  constructor(protected readonly service: InteractionService) {
    super(service);
  }

  /*
  @Post()
  async create(@Body() createDto: InteractionDto) {
    return this.service.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateInteractionDto
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.service.delete(id);
  }
  */
}
