import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attachment } from './entities/attachment.entity';
import { AttachmentService } from './attachment.service';
import {
  AttachmentController
} from './attachment.controller';
import { SecurityModule } from 'apps/api/src/core/security/security.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    SecurityModule,  
  ],
  controllers: [AttachmentController],
  providers: [AttachmentService],
  exports: [],
})
export class AttachmentModule {}
