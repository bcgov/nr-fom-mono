import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CodeTableService } from 'apps/api/src/core/models/code-provider.model';

@Controller()
export class CodeTableController<E, C, U> {
  // @ts-ignore
  constructor(protected readonly service: CodeTableService<E, Repository<E>>) {}

  @Post()
  create(@Body() createDto: C) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number | string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number | string, @Body() updateDto: U) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number | string) {
    return this.service.remove(id);
  }
}
