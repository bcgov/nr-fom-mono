import { DataService } from '@core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { ForestClientResponse } from './forest-client.dto';
import { ForestClient } from './forest-client.entity';

@Injectable()
export class ForestClientBatchService extends DataService<ForestClient, Repository<ForestClient>, ForestClientResponse> {
  constructor(
    @InjectRepository(ForestClient)
    repository: Repository<ForestClient>,
    logger: PinoLogger
  ) {
    super(repository, new ForestClient(), logger);
  }

}
