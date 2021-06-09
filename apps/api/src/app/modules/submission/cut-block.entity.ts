import { ApiBaseEntity } from '@entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  ManyToOne,
  RelationId,
  OneToMany
} from 'typeorm';
import { PublicComment } from '../public-comment/public-comment.entity';
import { Submission } from './submission.entity';

@Entity('cut_block', { schema: 'app_fom' })
export class CutBlock extends ApiBaseEntity<CutBlock> {
  constructor(cutBlock?: Partial<CutBlock>) {
    super(cutBlock);
  }

  @PrimaryGeneratedColumn('increment', { name: 'cut_block_id' })
  public id: number;

  @Column({ type: 'geometry', spatialFeatureType: 'Polygon', srid: 3005 })
  geometry: any;

  @Column({ name: 'planned_development_date'})
  plannedDevelopmentDate: string; // timestamp

  @Column()
  name: string;

  @Column({ name: 'planned_area_ha'})
  plannedAreaHa: number;

  @ManyToOne(() => Submission, (submission) => submission.cutBlocks, {onDelete: 'CASCADE', orphanedRowAction:'delete'})
  @JoinColumn({ name: 'submission_id', referencedColumnName: 'id' })
  submission: Submission;

  @Column({name: 'submission_id'})
  @RelationId((cutBlock: CutBlock) => cutBlock.submission)
  submissionId: number;

  @OneToMany(type => PublicComment, (comment) => comment.cutBlock, {cascade: true})
  comments: PublicComment[];
}
