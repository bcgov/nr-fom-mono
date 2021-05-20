import { Column, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

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
}

export abstract class ApiBaseEntity<M> extends ApiBaseReadOnlyEntity<M> {
  // Primary key needs to be declared in concrete entity classes in order to specify the column name - different for each table as per client naming standard.

  // Metadata columns
  @VersionColumn({ name: 'revision_count' })
  public revision_count: number;

  @CreateDateColumn({ name: 'create_timestamp', type: 'timestamptz' })
  public create_timestamp: Date;

  @Column({ name: 'create_user'})
  public create_user: string;

  @UpdateDateColumn({ name: 'update_timestamp', type: 'timestamptz' })
  public update_timestamp: Date;

  @Column({ name: 'update_user'})
  public update_user: string;

}
