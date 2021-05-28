import { Controller } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataService } from 'apps/api/src/core/models/data.service';

// TODO: Remove.
@Controller()
export class BaseController<E> {
  // @ts-ignore
  constructor(protected readonly service: DataService<E, Repository<E>>) {}

}
