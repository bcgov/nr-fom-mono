import { ApiBaseEntity } from '../../../../core/entities/base.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user')
export class User extends ApiBaseEntity<User> {
  constructor(user?: Partial<User>) {
    super(user);
  }

  @Column()
  username: string;

  @Column({ name: 'first_name'})
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;
}
