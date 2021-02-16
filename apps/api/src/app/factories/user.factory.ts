import * as Faker from 'faker';
import { User } from '../controllers/user/entities/user.entity';

export function userFactory() {
  const username = Faker.internet.email();
  const id = Math.random();

  return new User({ id, username });
}

export function userPropsFactory() {
  const username = Faker.internet.email();
  return { username };
}
