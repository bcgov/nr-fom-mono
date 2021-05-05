import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AttachmentService extends DataService<Attachment, Repository<Attachment>> {
  constructor(
    @InjectRepository(Attachment)
    repository: Repository<Attachment>,
    logger: PinoLogger
  ) {
    super(repository, new Attachment(), logger);
  }
}
