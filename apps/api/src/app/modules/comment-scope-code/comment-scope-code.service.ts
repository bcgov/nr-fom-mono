import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentScopeCode } from './entities/comment-scope-code.entity';
import { CodeTableService } from 'apps/api/src/core/models/code-provider.model';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class CommentScopeCodeService extends CodeTableService<
  CommentScopeCode,
  Repository<CommentScopeCode>
> {
  constructor(
    @InjectRepository(CommentScopeCode)
    repository: Repository<CommentScopeCode>,
    logger: PinoLogger
  ) {
    super(repository, new CommentScopeCode(), logger);
  }
}
