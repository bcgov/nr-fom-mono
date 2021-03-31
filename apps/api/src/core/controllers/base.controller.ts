import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

@Controller()
export class BaseController<E, C, U> {
  // @ts-ignore
  constructor(protected readonly service: DataService<E, Repository<E>>) {}

  @Post()
  async create(@Body() createDto: C) {
    return this.service.create<C>(createDto);
  }

  @Get()
  async findAll(options?: FindManyOptions<E> | undefined) {
    return this.service.findAll(options);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.service.findOne<C>(id);
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
