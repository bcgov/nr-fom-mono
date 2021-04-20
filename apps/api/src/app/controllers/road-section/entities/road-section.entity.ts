import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { Submission } from '../../submission/entities/submission.entity';

@Entity('road_section', {schema: 'app_fom'})
export class RoadSection extends ApiBaseEntity<RoadSection> {
  constructor(roadSection?: Partial<RoadSection>) {
    super(roadSection);
  }

  @PrimaryGeneratedColumn('increment', {name: 'road_section_id'})
  public id: number;

  @Column({ type: 'geometry', spatialFeatureType: 'LineString', srid: 3005 })
  geometry: string;

  @Column()
  planned_development_date: string; // timestamp

  @Column()
  name: string;

  @Column()
  planned_length_km: number;

  @ManyToOne(() => Submission, (submission) => submission.road_sections)
  @JoinColumn({ name: 'submission_id', referencedColumnName: 'id' })
  submission: Submission;

  @Column()
  @RelationId((roadSection: RoadSection) => roadSection.submission)
  submission_id: number;
}
