import { PrimaryColumn, Column } from 'typeorm';
import { DeepPartial } from './base.entity';

export abstract class ApiCodeTableEntity<M> {
  @PrimaryColumn() code: string;
  @Column() description: string;

  // No need for metadata columns as the app only reads from code tables.

  protected constructor(model?: Partial<M>) {
    Object.assign(this, model);
  }

  factory(props: Partial<M>): DeepPartial<M> {
    const model = Object.create(this);

    Object.assign(model, props);

    return model;
  }
}
