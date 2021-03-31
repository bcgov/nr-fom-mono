import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { SubmissionTypeCode } from '../../submission-type-code/entities/submission-type-code.entity';
import { CutBlock } from '../../cut-block/entities/cut-block.entity';

@Entity('submission', {schema: 'app_fom'})
export class Submission extends ApiBaseEntity<Submission> {
  constructor(submission?: Partial<Submission>) {
    super(submission);
  }

  @PrimaryGeneratedColumn('increment', {name: 'submission_id'})
  public id: number;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 3005 })
  geometry: any;

  @ManyToOne(() => Project, { eager: true })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: Project;

  @Column()
  @RelationId((submission: Submission) => submission.project)
  project_id: number;

  @ManyToOne(() => SubmissionTypeCode)
  @JoinColumn({ name: 'submission_type_code', referencedColumnName: 'code' })
  submission_type: SubmissionTypeCode;

  @Column()
  @RelationId((submission: Submission) => submission.submission_type)
  submission_type_code: string;

  @OneToMany(type => CutBlock, (cutBlock) => cutBlock.submission)
  cutBlocks: CutBlock[];
}
