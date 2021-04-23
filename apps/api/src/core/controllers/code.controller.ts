import { Controller, Get, Param } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CodeTableService } from 'apps/api/src/core/models/code-provider.model';

@Controller()
export class CodeTableController<E, C, U> {
  // @ts-ignore
  constructor(protected readonly service: CodeTableService<E, Repository<E>>) {}

  @Get()
  async findAll(): Promise<C[]> {
    return this.service.findAll<C>();
  }

  @Get(':id')
  async findOne(@Param('id') id: number | string): Promise<C> {
    return this.service.findOne<C>(id);
  }
}
