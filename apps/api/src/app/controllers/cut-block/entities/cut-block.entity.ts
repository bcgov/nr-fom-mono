import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { Submission } from '../../submission/entities/submission.entity';

@Entity('cut_block', {schema: 'app_fom'})
export class CutBlock extends ApiBaseEntity<CutBlock> {
  constructor(cutBlock?: Partial<CutBlock>) {
    super(cutBlock);
  }

  @PrimaryGeneratedColumn('increment', {name: 'cut_block_id'})
  public id: number;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 3005 })
  geometry: any;

  @Column()
  planned_development_date: string; // timestamp

  @Column()
  planned_area_ha: number;

  @ManyToOne(() => Submission, (submission) => submission.cut_blocks)
  @JoinColumn({ name: 'submission_id', referencedColumnName: 'id' })
  submission: Submission;

  @Column()
  @RelationId((cutBlock: CutBlock) => cutBlock.submission)
  submission_id: number;
}
