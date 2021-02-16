import { ApiCodeTableEntity } from '../../../../core/entities/code.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('attachment_type_code')
export class AttachmentTypeCode extends ApiCodeTableEntity<AttachmentTypeCode> {
  constructor(attachmentTypeCode?: Partial<AttachmentTypeCode>) {
    super(attachmentTypeCode);
  }
}
