import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attachment } from './entities/attachment.entity';
import { AttachmentService } from './attachment.service';
import { AttachmentController, AttachmentsController } from './attachment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment])],
  controllers: [AttachmentController, AttachmentsController],
  providers: [AttachmentService],
  exports: []
})
export class AttachmentModule {}
