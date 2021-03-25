import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, Column, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { WorkflowStateCode } from '../../workflow-state-code/entities/workflow-state-code.entity';
import { District } from '../../district/entities/district.entity';
import { ForestClient } from '../../forest-client/entities/forest-client.entity';

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

  @ManyToOne(() => District, { eager: true})
  @JoinColumn({ name: 'district_id', referencedColumnName: 'id' })
  district: District;

  @ManyToOne(() => ForestClient, { eager: true})
  @JoinColumn({ name: 'forest_client_number', referencedColumnName: 'id' })
  forestClient: ForestClient;

  @ManyToOne(() => WorkflowStateCode, { eager: true})
  @JoinColumn({ name: 'workflow_state_code' })
  workflowStateCode: string;
}
