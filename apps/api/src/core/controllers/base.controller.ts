import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataService } from 'apps/api/src/core/models/data-provider.model';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@Controller()
export class BaseController<E, C, U> {
  // @ts-ignore
  constructor(protected readonly service: DataService<E, Repository<E>>) {}

  protected createNotAuthorizedException() {
    return new HttpException("Not authorized.", HttpStatus.FORBIDDEN);
  }
}
