import { ApiBaseEntity } from '../../../../core/entities/base.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user')
export class User extends ApiBaseEntity<User> {
  // @Column() username: string;
  // @Column() firstName: string;
  // @Column() lastName: string;
  username: string;
  firstName: string;
  lastName: string;

  constructor(user?: Partial<User>) {
    super(user);
  }
}
