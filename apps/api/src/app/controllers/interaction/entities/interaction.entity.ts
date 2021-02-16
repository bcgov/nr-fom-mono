import { ApiBaseEntity } from '../../../../core/entities/base.entity';
import { Entity, PrimaryColumn, JoinColumn, Column } from 'typeorm';

@Entity('interaction')
export class Interaction extends ApiBaseEntity<Interaction> {
  constructor(interaction?: Partial<Interaction>) {
    super(interaction);
  }

  @Column()
  stakeholder: string;

  @Column({ name: 'communication_date' })
  communicationDate: string; // timestamp

  @Column({ name: 'communication_details' })
  communicationDetails: string;

  @JoinColumn({ name: 'project_id' })
  projectId: number;

  @JoinColumn({ name: 'attachment_id' })
  attachmentId: number;
}
