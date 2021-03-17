import { ApiBaseEntity } from '@entities';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user')
export class User extends ApiBaseEntity<User> {
  constructor(user?: Partial<User>) {
    super(user);
  }

  @PrimaryColumn()
  id: number;

  @Column()
  username: string;

  @Column({ name: 'first_name'})
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;
}
