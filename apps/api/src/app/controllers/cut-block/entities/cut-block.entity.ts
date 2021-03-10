import { ApiBaseEntity } from '../../../../core/entities/base.entity';
import { Entity, PrimaryColumn, JoinColumn, Column } from 'typeorm';

@Entity('cut_block')
export class CutBlock extends ApiBaseEntity<CutBlock> {
  constructor(cutBlock?: Partial<CutBlock>) {
    super(cutBlock);
  }

  /* @Column({ name: 'geometry', type: 'geometry' })
  geometry: any; */

  @Column({ name: 'planned_development_date' })
  plannedDevelopmentDate: string; // timestamp

  @Column({ name: 'planned_area_ha' })
  plannedAreaHa: number;

  @JoinColumn({ name: 'submission_id' })
  submissionId: number;
}
