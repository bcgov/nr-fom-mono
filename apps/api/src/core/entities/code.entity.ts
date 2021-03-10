import { PrimaryColumn, Column } from 'typeorm';
import { DeepPartial } from './base.entity';

export abstract class ApiCodeTableEntity<M> {
  @PrimaryColumn() code: string;
  @Column() description: string;

  protected constructor(model?: Partial<M>) {
    Object.assign(this, model);
  }

  factory(props: Partial<M>): DeepPartial<M> {
    const model = Object.create(this);

    Object.assign(model, props);

    return model;
  }
}
