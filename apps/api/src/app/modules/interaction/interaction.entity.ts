import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { Project } from '../project/project.entity';
import { Attachment } from '../attachment/attachment.entity';

@Entity('interaction', {schema: 'app_fom'})
export class Interaction extends ApiBaseEntity<Interaction> {
  constructor(interaction?: Partial<Interaction>) {
    super(interaction);
  }

  @PrimaryGeneratedColumn('increment', {name: 'interaction_id'})
  public id: number;

  @Column()
  stakeholder: string;

  @Column({ name: 'communication_date'})
  communicationDate: string; // timestamp

  @Column({ name: 'communication_details'})
  communicationDetails: string;

  @Column({ name: 'project_id'})
  projectId: number;

  // @JoinColumn({ name: 'attachment_id', referencedColumnName: 'id' })
  // attachment: Attachment;

  @Column({ name: 'attachment_id'})
  // @RelationId((interaction: Interaction) => interaction.attachment)
  attachmentId: number;
}
