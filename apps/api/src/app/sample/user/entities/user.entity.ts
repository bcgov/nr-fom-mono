import { ApiBaseEntity } from '@entities';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User extends ApiBaseEntity<User> {
  constructor(user?: Partial<User>) {
    super(user);
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  username: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;
}
