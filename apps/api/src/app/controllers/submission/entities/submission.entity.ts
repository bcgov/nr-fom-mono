import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, Column } from 'typeorm';

@Entity('submission', {schema: 'app_fom'})
export class Submission extends ApiBaseEntity<Submission> {
  constructor(submission?: Partial<Submission>) {
    super(submission);
  }

  @PrimaryGeneratedColumn('increment', {name: 'submission_id'})
  public id: number;

  @Column({ name: 'geometry', type: 'geometry' })
  geometry: any;

  @JoinColumn({ name: 'project_id' })
  projectId: number;

  @JoinColumn({ name: 'submission_type_code' })
  submissionTypeCode: string;
}
