import { ApiBaseEntity } from '../../../../core/entities/base.entity';
import { Entity, PrimaryColumn, JoinColumn, Column } from 'typeorm';

@Entity('retention_area')
export class RetentionArea extends ApiBaseEntity<RetentionArea> {
  constructor(retentionArea?: Partial<RetentionArea>) {
    super(retentionArea);
  }

  /* @Column({ name: 'geometry', type: 'geometry' })
  geometry: any; */

  @Column({ name: 'planned_area_ha' })
  plannedAreaHa: number;

  @JoinColumn({ name: 'submission_id' })
  submissionId: number;
}
