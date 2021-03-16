import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, Column } from 'typeorm';

@Entity('retention_area', {schema: 'app_fom'})
export class RetentionArea extends ApiBaseEntity<RetentionArea> {
  constructor(retentionArea?: Partial<RetentionArea>) {
    super(retentionArea);
  }

  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ name: 'geometry', type: 'geometry' })
  geometry: any;

  @Column({ name: 'planned_area_ha' })
  plannedAreaHa: number;

  @JoinColumn({ name: 'submission_id' })
  submissionId: number;
}
