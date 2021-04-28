import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { SubmissionTypeCode } from '../../submission-type-code/entities/submission-type-code.entity';
import { CutBlock } from '../../cut-block/entities/cut-block.entity';
import { RetentionArea } from '../../retention-area/entities/retention-area.entity';
import { RoadSection } from '../../road-section/entities/road-section.entity';

@Entity('submission', {schema: 'app_fom'})
export class Submission extends ApiBaseEntity<Submission> {
  constructor(submission?: Partial<Submission>) {
    super(submission);
  }

  @PrimaryGeneratedColumn('increment', {name: 'submission_id'})
  public id: number;

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
  cut_blocks: CutBlock[];

  @OneToMany(type => RetentionArea, (retentionArea) => retentionArea.submission)
  retention_areas: RetentionArea[];

  @OneToMany(type => RoadSection, (roadSection) => roadSection.submission)
  road_sections: RoadSection[];
}
