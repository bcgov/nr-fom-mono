import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { Attachment } from '../../attachment/entities/attachment.entity';

@Entity('interaction', {schema: 'app_fom'})
export class Interaction extends ApiBaseEntity<Interaction> {
  constructor(interaction?: Partial<Interaction>) {
    super(interaction);
  }

  @PrimaryGeneratedColumn('increment', {name: 'interaction_id'})
  public id: number;

  @Column()
  stakeholder: string;

  @Column()
  communication_date: string; // timestamp

  @Column()
  communication_details: string;

  @ManyToOne(() => Project, { eager: true })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: Project;

  @Column()
  @RelationId((interaction: Interaction) => interaction.project)
  project_id: number;

  @ManyToOne(() => Attachment, { eager: true })
  @JoinColumn({ name: 'attachment_id', referencedColumnName: 'id' })
  attachment: Attachment;

  @Column()
  @RelationId((interaction: Interaction) => interaction.attachment)
  attachment_id: number;
}
