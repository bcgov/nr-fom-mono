import { ApiCodeTableEntity } from '@entities';
import { Entity } from 'typeorm';

@Entity('project_plan_code', {schema: 'app_fom'})
export class ProjectPlanCode extends ApiCodeTableEntity<ProjectPlanCode> {
  constructor(projectPlanCode?: Partial<ProjectPlanCode>) {
    super(projectPlanCode);
  }
}

export enum ProjectPlanCodeEnum {
  FSP = 'FSP',
  WOODLOT = 'WOODLOT'
}
