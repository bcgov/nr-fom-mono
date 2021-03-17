import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, Column } from 'typeorm';

@Entity('road_section', {schema: 'app_fom'})
export class RoadSection extends ApiBaseEntity<RoadSection> {
  constructor(roadSection?: Partial<RoadSection>) {
    super(roadSection);
  }

  @PrimaryGeneratedColumn('increment', {name: 'road_section_id'})
  public id: number;
  
  @Column({ name: 'geometry', type: 'geometry' })
  geometry: any;

  @Column({ name: 'planned_development_date' })
  plannedDevelopmentDate: string; // timestamp

  @Column({ name: 'planned_length_km' })
  plannedLengthKm: number;

  @JoinColumn({ name: 'submission_id' })
  submissionId: number;
}
