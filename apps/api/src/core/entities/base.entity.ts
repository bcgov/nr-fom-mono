// import { ObjectId } from 'bson';
import { Entity, PrimaryGeneratedColumn, Column, VersionColumn } from 'typeorm';
// import { Entity, ObjectID, ObjectIdColumn } from 'typeorm';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]> | T[P];
};

export abstract class ApiBaseEntity<M> {

  // Needs to be declared in concrete entity classes in order to specify the column name - different for each table as per client naming standard.
  // @PrimaryGeneratedColumn('increment')
  // public id: number;

  // Metadata columns
  @Column()
  public revision_count: number;

  @Column()
  public create_timestamp: string;

  @Column()
  public create_user: string;

  @Column()
  public update_timestamp: string;

  @Column({ name: 'update_user' })
  public update_user: string;

  constructor(model?: Partial<M>) {
    Object.assign(this, model);
  }

  factory(props: Partial<M>): DeepPartial<M> {
    const model = Object.create(this);

    Object.assign(model, props);

    return model;
  }
}
