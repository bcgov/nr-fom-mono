import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne, RelationId, OneToMany } from 'typeorm';
import { WorkflowStateCode } from '../../workflow-state-code/entities/workflow-state-code.entity';
import { District } from '../../district/entities/district.entity';
import { ForestClient } from '../../forest-client/entities/forest-client.entity';
import { Submission } from '../../submission/entities/submission.entity';
import { FomPoint } from '../dto/project.dto';

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

  @Column({ name: 'commenting_open_date'})
  commentingOpenDate: string; // timestamp

  @Column({ name: 'commenting_closed_date'})
  commentingClosedDate: string; // timestamp

  @Column({ name: 'geometry_latlong', type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  geojson: FomPoint;

  @Column({ name: 'fsp_id'})
  fspId: number;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id', referencedColumnName: 'id' })
  district: District;

  @Column({ name: 'district_id'})
  @RelationId((project: Project) => project.district)
  districtId: number;

  @ManyToOne(() => ForestClient)
  @JoinColumn({ name: 'forest_client_number', referencedColumnName: 'id' })
  forestClient: ForestClient;

  @Column({ name: 'forest_client_number'})
  @RelationId((project: Project) => project.forestClient)
  forestClientId: string;

  @ManyToOne(() => WorkflowStateCode)
  @JoinColumn({ name: 'workflow_state_code' })
  workflowState: WorkflowStateCode;

  @Column({ name: 'workflow_state_code'})
  @RelationId((project: Project) => project.workflowState)
  workflowStateCode?: string;

  // @OneToMany(type => Submission, (submission) => submission.project)
  // submissions: Submission[];

}
