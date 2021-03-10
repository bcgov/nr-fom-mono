import { ApiCodeTableEntity } from '@entities';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('workflow_state_code')
export class WorkflowStateCode extends ApiCodeTableEntity<WorkflowStateCode> {
  constructor(workflowStateCode?: Partial<WorkflowStateCode>) {
    super(workflowStateCode);
  }
}
