import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Interaction } from './interaction.entity';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { SecurityModule } from 'src/core/security/security.module';
import { AttachmentModule } from '../attachment/attachment.module';
import { ProjectAuthModule } from '@api-modules/project/project-auth.module';
import { ProjectModule } from '@api-modules/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interaction]),
    ProjectAuthModule,
    ProjectModule,
    AttachmentModule,
    SecurityModule,
  ],
  controllers: [InteractionController],
  providers: [InteractionService],
  exports: [],
})
export class InteractionModule {}
