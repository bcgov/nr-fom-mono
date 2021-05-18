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

  @Column()
  commenting_open_date: string; // timestamp

  @Column()
  commenting_closed_date: string; // timestamp

  @Column({ name: 'geometry_latlong', type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  geojson: FomPoint;

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
  forest_client_number?: string;

  @ManyToOne(() => WorkflowStateCode)
  @JoinColumn({ name: 'workflow_state_code' })
  workflow_state: WorkflowStateCode;

  @Column()
  @RelationId((project: Project) => project.workflow_state)
  workflow_state_code?: string;

  @OneToMany(type => Submission, (submission) => submission.project)
  submissions: Submission[];

}
