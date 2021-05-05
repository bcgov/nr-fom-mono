import * as Faker from 'faker';
import { Project } from '../modules/project/entities/project.entity';

export function projectFactory() {
  return new Project();
}

export function projectPropsFactory() {
  return {};
}
