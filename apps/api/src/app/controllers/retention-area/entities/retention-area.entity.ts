import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { Submission } from '../../submission/entities/submission.entity';

@Entity('retention_area', {schema: 'app_fom'})
export class RetentionArea extends ApiBaseEntity<RetentionArea> {
  constructor(retentionArea?: Partial<RetentionArea>) {
    super(retentionArea);
  }

  @PrimaryGeneratedColumn('increment', {name: 'retention_area_id'})
  public id: number;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 3005 })
  geometry: string;

  @Column()
  planned_area_ha: number;

  @ManyToOne(() => Submission, (submission) => submission.retention_areas)
  @JoinColumn({ name: 'submission_id', referencedColumnName: 'id' })
  submission: Submission;

  @Column()
  @RelationId((retentionArea: RetentionArea) => retentionArea.submission)
  submission_id: number;
}
