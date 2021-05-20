import { Controller } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataService } from 'apps/api/src/core/models/data.service';

@Controller()
export class BaseController<E, C, U> {
  // @ts-ignore
  constructor(protected readonly service: DataService<E, Repository<E>>) {}

}
