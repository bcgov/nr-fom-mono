import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseCode } from './response-code.entity';
import { CodeTableService } from 'apps/api/src/core/models/code-table.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ResponseCodeService extends CodeTableService<ResponseCode, Repository<ResponseCode>> {
  constructor(
    @InjectRepository(ResponseCode)
    repository: Repository<ResponseCode>,
    logger: PinoLogger
  ) {
    super(repository, new ResponseCode(), logger);
  }
}
