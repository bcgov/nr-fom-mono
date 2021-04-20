import { Controller, Get, Param } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataReadOnlyService } from 'apps/api/src/core/models/data-readonly-provider.model';

@Controller()
export class BaseReadOnlyController<E> {
  // @ts-ignore
  constructor(protected readonly service: DataReadOnlyService<E, Repository<E>>) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

}
