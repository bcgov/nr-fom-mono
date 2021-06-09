import { ApiBaseEntity } from '@entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  ManyToOne,
  RelationId,
  OneToMany,
} from 'typeorm';
import { PublicComment } from '../public-comment/public-comment.entity';
import { Submission } from './submission.entity';

@Entity('road_section', { schema: 'app_fom' })
export class RoadSection extends ApiBaseEntity<RoadSection> {
  constructor(roadSection?: Partial<RoadSection>) {
    super(roadSection);
  }

  @PrimaryGeneratedColumn('increment', { name: 'road_section_id' })
  public id: number;

  @Column({ type: 'geometry', spatialFeatureType: 'LineString', srid: 3005 })
  geometry: any;

  @Column({ name: 'planned_development_date'})
  plannedDevelopmentDate: string; // timestamp

  @Column()
  name: string;

  @Column({ name: 'planned_length_km'})
  plannedLengthKm: number;

  @ManyToOne(() => Submission, (submission) => submission.roadSections, {onDelete: 'CASCADE', orphanedRowAction:'delete'})
  @JoinColumn({ name: 'submission_id', referencedColumnName: 'id' })
  submission: Submission;

  @Column({ name: 'submission_id'})
  @RelationId((roadSection: RoadSection) => roadSection.submission)
  submissionId: number;
  
  @OneToMany(type => PublicComment, (comment) => comment.roadSection, {cascade: true})
  comments: PublicComment[];
}
