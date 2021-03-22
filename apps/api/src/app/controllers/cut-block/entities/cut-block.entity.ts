import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, Column } from 'typeorm';

@Entity('cut_block', {schema: 'app_fom'})
export class CutBlock extends ApiBaseEntity<CutBlock> {
  constructor(cutBlock?: Partial<CutBlock>) {
    super(cutBlock);
  }

  @PrimaryGeneratedColumn('increment', {name: 'cut_block_id'})
  public id: number;

  @Column({ name: 'geometry', type: 'geometry' })
  geometry: any;

  @Column({ name: 'planned_development_date' })
  plannedDevelopmentDate: string; // timestamp

  @Column({ name: 'planned_area_ha' })
  plannedAreaHa: number;

  @Column({ name: 'submission_id' })
  submissionId: number;
}
