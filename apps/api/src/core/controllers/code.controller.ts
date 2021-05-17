import { Controller, Get } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CodeTableService } from 'apps/api/src/core/models/code-provider.model';

@Controller()
export class CodeTableController<E> {
  // @ts-ignore
  constructor(protected readonly service: CodeTableService<E, Repository<E>>) {}

  @Get()
  async findAll(): Promise<E[]> {
    return this.service.findAll<E>();
  }

}
