import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Interaction } from './interaction.entity';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { SecurityModule } from 'apps/api/src/core/security/security.module';
import { AttachmentModule } from '../attachment/attachment.module';
import { ProjectAuthModule } from '@api-modules/project/project-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interaction]),
    ProjectAuthModule,
    AttachmentModule,
    SecurityModule,
  ],
  controllers: [InteractionController],
  providers: [InteractionService],
  exports: [],
})
export class InteractionModule {}
