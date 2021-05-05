import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryGeneratedColumn, JoinColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { AttachmentTypeCode } from '../../attachment-type-code/entities/attachment-type-code.entity';

@Entity('attachment', {schema: 'app_fom'})
export class Attachment extends ApiBaseEntity<Attachment> {
  constructor(attachment?: Partial<Attachment>) {
    super(attachment);
  }

  @PrimaryGeneratedColumn('increment', {name: 'attachment_id'})
  public id: number;

  @Column()
  file_name: string;

  @Column()
  file_contents: string; // bytearray

  @ManyToOne(() => Project, { eager: true })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: Project;

  @Column()
  @RelationId((attachment: Attachment) => attachment.project)
  project_id: number;

  @ManyToOne(() => AttachmentTypeCode)
  @JoinColumn({ name: 'attachment_type_code', referencedColumnName: 'code' })
  attachment_type: AttachmentTypeCode;

  @Column()
  @RelationId((attachment: Attachment) => attachment.attachment_type)
  attachment_type_code: string;
}
