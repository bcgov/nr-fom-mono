import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Interaction } from './entities/interaction.entity';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Interaction])],
  controllers: [InteractionController],
  providers: [InteractionService],
  exports: []
})
export class InteractionModule {}
