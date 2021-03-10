import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryColumn, JoinColumn, Column } from 'typeorm';

@Entity('attachment')
export class Attachment extends ApiBaseEntity<Attachment> {
  constructor(attachment?: Partial<Attachment>) {
    super(attachment);
  }

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_contents' })
  fileContents: string; // bytearray

  @JoinColumn({ name: 'project_id' })
  projectId: number;

  @JoinColumn({ name: 'attachment_type_code' })
  attachmentTypeCode: string;
}
