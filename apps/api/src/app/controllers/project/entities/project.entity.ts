import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, Column } from 'typeorm';

@Entity('project')
export class Project extends ApiBaseEntity<Project> {
  constructor(project?: Partial<Project>) {
    super(project);
  }

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'commenting_open_date' })
  commentingOpenDate: string; // timestamp

  @Column({ name: 'commenting_closed_date' })
  commentingClosedDate: string; // timestamp

  @JoinColumn({ name: 'fsp_id' })
  fspId: number;

  @JoinColumn({ name: 'district_id' })
  districtId: number;

  @JoinColumn({ name: 'forest_client_number' })
  forestClientNumber: number;

  @JoinColumn({ name: 'workflow_state_code' })
  workflowStateCode: string;
}
