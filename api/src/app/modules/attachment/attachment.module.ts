import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attachment } from './attachment.entity';
import { AttachmentService } from './attachment.service';
import {
  AttachmentController
} from './attachment.controller';
import { SecurityModule } from 'apps/api/src/core/security/security.module';
import { AttachmentTypeCode } from './attachment-type-code.entity';
import { AttachmentTypeCodeService } from './attachment-type-code.service';
import { AttachmentTypeCodeController } from './attachment-type-code.controller';
import { ProjectAuthModule } from '../project/project-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment, AttachmentTypeCode]),
    ProjectAuthModule,
    SecurityModule,  
  ],
  controllers: [AttachmentController, AttachmentTypeCodeController],
  providers: [AttachmentService, AttachmentTypeCodeService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
