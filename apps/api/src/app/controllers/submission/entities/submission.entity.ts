import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne} from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { SubmissionTypeCode } from '../../submission-type-code/entities/submission-type-code.entity';

@Entity('submission', {schema: 'app_fom'})
export class Submission extends ApiBaseEntity<Submission> {
  constructor(submission?: Partial<Submission>) {
    super(submission);
  }

  @PrimaryGeneratedColumn('increment', {name: 'submission_id'})
  public id: number;

  @Column({ name: 'geometry', type: 'geometry' })
  geometry: any;

  @ManyToOne(() => Project, { eager: true })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: Project;

  @Column({ name: 'submission_type_code' })
  @ManyToOne(() => SubmissionTypeCode, { eager: true})
  @JoinColumn({ name: 'submission_type_code', referencedColumnName: 'code' })
  submissionTypeCode: SubmissionTypeCode;
}
