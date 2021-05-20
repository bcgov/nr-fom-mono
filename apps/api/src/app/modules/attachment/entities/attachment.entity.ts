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

  @Column({ name: 'file_name'})
  fileName: string;

  @Column({ name: 'file_contents'})
  fileContents: string; // TODO: bytearray instead?

  @ManyToOne(() => Project, { eager: true })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: Project;

  @Column({ name: 'project_id'})
  @RelationId((attachment: Attachment) => attachment.project)
  projectId: number;

  @ManyToOne(() => AttachmentTypeCode)
  @JoinColumn({ name: 'attachment_type_code', referencedColumnName: 'code' })
  attachmentType: AttachmentTypeCode;

  @Column({ name: 'attachment_type_code'})
  @RelationId((attachment: Attachment) => attachment.attachmentType)
  attachmentTypeCode: string;
}
