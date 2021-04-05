import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CodeTableService } from 'apps/api/src/core/models/code-provider.model';

@Controller()
export class CodeTableController<E, C, U> {
  // @ts-ignore
  constructor(protected readonly service: CodeTableService<E, Repository<E>>) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number | string) {
    return this.service.findOne(id);
  }
}
