import { ObjectID } from 'bson';
import * as Faker from 'faker';
import { User } from '../controllers/user/entities/user.entity';

export function userFactory() {
  const username = Faker.internet.email();
  const _id = new ObjectID();

  return new User({ _id, username });
}

export function userPropsFactory() {
  const username = Faker.internet.email();
  return { username };
}
