import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Interaction } from './entities/interaction.entity';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { SecurityModule } from 'apps/api/src/core/security/security.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interaction]),
    SecurityModule,
  ],
  controllers: [InteractionController],
  providers: [InteractionService],
  exports: [],
})
export class InteractionModule {}
