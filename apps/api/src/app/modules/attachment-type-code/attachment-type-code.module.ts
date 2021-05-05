import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttachmentTypeCode } from './entities/attachment-type-code.entity';
import { AttachmentTypeCodeService } from './attachment-type-code.service';
import { AttachmentTypeCodeController } from './attachment-type-code.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AttachmentTypeCode])],
  controllers: [AttachmentTypeCodeController],
  providers: [AttachmentTypeCodeService],
  exports: []
})
export class AttachmentTypeCodeModule {}
