import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne, RelationId } from 'typeorm';
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

  @Column()
  commenting_open_date: string; // timestamp

  @Column()
  commenting_closed_date: string; // timestamp

  @Column()
  fsp_id: number;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id', referencedColumnName: 'id' })
  district: District;

  @Column()
  @RelationId((project: Project) => project.district)
  district_id: number;

  @ManyToOne(() => ForestClient)
  @JoinColumn({ name: 'forest_client_number', referencedColumnName: 'id' })
  forest_client: ForestClient;

  @Column()
  @RelationId((project: Project) => project.forest_client)
  forest_client_number?: number;

  @ManyToOne(() => WorkflowStateCode)
  @JoinColumn({ name: 'workflow_state_code' })
  workflow_state: WorkflowStateCode;

  @Column()
  @RelationId((project: Project) => project.workflow_state)
  workflow_state_code?: string;
}
