import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttachmentTypeCode } from './entities/attachment-type-code.entity';
import { CodeTableService } from 'apps/api/src/core/models/code-table.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AttachmentTypeCodeService extends CodeTableService<AttachmentTypeCode, Repository<AttachmentTypeCode>> {
  constructor(
    @InjectRepository(AttachmentTypeCode)
    repository: Repository<AttachmentTypeCode>,
    logger: PinoLogger
  ) {
    super(repository, new AttachmentTypeCode(), logger);
  }
}
