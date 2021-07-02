import { Controller } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataReadOnlyService } from 'apps/api/src/core/models/data-readonly.service';

@Controller()
export class BaseReadOnlyController<E, C> {
  constructor(
    // @ts-ignore
    protected readonly service: DataReadOnlyService<E, Repository<E>>
  ) {}

  findAll(): Promise<C[]> {
    return this.service.findAll<C>();
  }

  findOne(id: number): Promise<C> {
    return this.service.findOne<C>(id);
  }
}
