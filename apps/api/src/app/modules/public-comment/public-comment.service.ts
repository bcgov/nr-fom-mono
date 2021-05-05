import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicComment } from './entities/public-comment.entity';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class PublicCommentService extends DataService<PublicComment, Repository<PublicComment>> {
  constructor(
    @InjectRepository(PublicComment)
    repository: Repository<PublicComment>,
    logger: PinoLogger
  ) {
    super(repository, new PublicComment(), logger);
  }
}
