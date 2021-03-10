import { ApiBaseEntity } from '../../../../core/entities/base.entity';
import { Entity, PrimaryColumn, JoinColumn, Column } from 'typeorm';

@Entity('road_section')
export class RoadSection extends ApiBaseEntity<RoadSection> {
  constructor(roadSection?: Partial<RoadSection>) {
    super(roadSection);
  }

  /* @Column({ name: 'geometry', type: 'geometry' })
  geometry: any; */

  @Column({ name: 'planned_development_date' })
  plannedDevelopmentDate: string; // timestamp

  @Column({ name: 'planned_length_km' })
  plannedLengthKm: number;

  @JoinColumn({ name: 'submission_id' })
  submissionId: number;
}
