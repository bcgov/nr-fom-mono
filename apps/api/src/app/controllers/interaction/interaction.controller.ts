import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../core/controllers/base.controller';
import { InteractionService } from './interaction.service';
import { Interaction } from './entities/interaction.entity';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';

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
}
