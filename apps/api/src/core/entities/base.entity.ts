// import { ObjectId } from 'bson';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { Entity, ObjectID, ObjectIdColumn } from 'typeorm';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]> | T[P];
};

export abstract class ApiBaseEntity<M> {
  // @ObjectIdColumn()
  // _id: ObjectId;
  @PrimaryGeneratedColumn('increment')
  public id: number;

  constructor(model?: Partial<M>) {
    Object.assign(this, model);
  }

  factory(props: Partial<M>): DeepPartial<M> {
    const model = Object.create(this);

    Object.assign(model, props);

    return model;
  }
}
