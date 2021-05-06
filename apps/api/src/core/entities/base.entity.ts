// import { ObjectId } from 'bson';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
// import { Entity, ObjectID, ObjectIdColumn } from 'typeorm';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]> | T[P];
};

export abstract class ApiBaseReadOnlyEntity<M> {

  // Do not include any metadata columns.

  constructor(model?: Partial<M>) {
    Object.assign(this, model);
  }

  factory(props: Partial<M>): DeepPartial<M> {
    const model = Object.create(this);

    Object.assign(model, props);

    return model;
  }
};

export abstract class ApiBaseEntity<M> extends ApiBaseReadOnlyEntity<M> {
  // Needs to be declared in concrete entity classes in order to specify the column name - different for each table as per client naming standard.
  // @PrimaryGeneratedColumn('entity_id')
  // public id: number;

  // Metadata columns
  @VersionColumn()
  public revision_count: number;

  @CreateDateColumn({ type: 'timestamptz' })
  public create_timestamp: Date;

  @Column()
  public create_user: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  public update_timestamp: Date;

  @Column()
  public update_user: string;

}
