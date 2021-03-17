import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, Column } from 'typeorm';

@Entity('project', {schema: 'app_fom'})
export class Project extends ApiBaseEntity<Project> {
  constructor(project?: Partial<Project>) {
    super(project);
  }

  @PrimaryGeneratedColumn('increment', {name: 'project_id'})
  public id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'commenting_open_date' })
  commentingOpenDate: string; // timestamp

  @Column({ name: 'commenting_closed_date' })
  commentingClosedDate: string; // timestamp

  @Column({ name: 'fsp_id' })
  fspId: number;

  // TODO: Using JoinColumn here didn't cause the POST to fail, but failed to save the specified value in the column.
  @Column({ name: 'district_id' })
  districtId: number;

  // TODO: Using @JoinColumn is not working for some reason
  @Column({ name: 'forest_client_number' })
  forestClientNumber: string;

  // TODO: Using @JoinColumn is not working for some reason.
  @Column({ name: 'workflow_state_code' })
  workflowStateCode: string;
}
