import { Controller, Get, Param } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataReadOnlyService } from 'apps/api/src/core/models/data-readonly-provider.model';

@Controller()
export class BaseReadOnlyController<E, C> {
  // @ts-ignore
  constructor(
    protected readonly service: DataReadOnlyService<E, Repository<E>>
  ) {}

  @Get()
  findAll(): Promise<C[]> {
    return this.service.findAll<C>();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<C> {
    return this.service.findOne<C>(id);
  }
}
