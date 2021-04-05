import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController, BaseCollectionController } from '@controllers';
import { InteractionService } from './interaction.service';
import { Interaction } from './entities/interaction.entity';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';

@ApiTags('interactions')
@Controller('interactions')
export class InteractionsController extends BaseCollectionController<
  Interaction,
  CreateInteractionDto,
  UpdateInteractionDto
> {
  constructor(protected readonly service: InteractionService) {
    super(service);
  }

  @Post()
  async findAll(@Body() options) {
    return super.findAll(options);
  }
}

@ApiTags('interaction')
@Controller('interaction')
export class InteractionController extends BaseController<
  Interaction,
  CreateInteractionDto,
  UpdateInteractionDto
> {
  constructor(protected readonly service: InteractionService) {
    super(service);
  }

  @Post()
  async create(@Body() createDto: CreateInteractionDto) {
    return super.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return super.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateInteractionDto
  ) {
    return super.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return super.remove(id);
  }
}
