import * as Faker from 'faker';
import { Project } from '../controllers/project/entities/project.entity';

export function projectFactory() {
  return new Project();
}

export function projectPropsFactory() {
  return {};
}
