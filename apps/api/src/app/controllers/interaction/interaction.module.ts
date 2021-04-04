import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Interaction } from './entities/interaction.entity';
import { InteractionService } from './interaction.service';
import {
  InteractionController,
  InteractionsController,
} from './interaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Interaction])],
  controllers: [InteractionController, InteractionsController],
  providers: [InteractionService],
  exports: [],
})
export class InteractionModule {}
