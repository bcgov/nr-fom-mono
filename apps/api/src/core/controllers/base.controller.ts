import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@Controller()
export class BaseController<E, C, U> {
  // @ts-ignore
  constructor(protected readonly service: DataService<E, Repository<E>>) {}

  async findAll(options?: FindManyOptions<E> | undefined): Promise<C[]> {
    return this.service.findAll<C>(options);
  }

  @Post()
  async create(@Body() createDto: C) {
    return this.service.create<C>(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, options?: FindOneOptions<E>) {
    return this.service.findOne<C>(id, options);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: U) {
    return this.service.update<U>(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
