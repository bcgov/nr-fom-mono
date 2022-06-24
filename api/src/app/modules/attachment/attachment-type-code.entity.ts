import { ApiCodeTableEntity } from '@entities';
import { Entity } from 'typeorm';

@Entity('attachment_type_code', {schema: 'app_fom'})
export class AttachmentTypeCode extends ApiCodeTableEntity<AttachmentTypeCode> {
  constructor(attachmentTypeCode?: Partial<AttachmentTypeCode>) {
    super(attachmentTypeCode);
  }
}

export enum AttachmentTypeEnum {
  PUBLIC_NOTICE = 'PUBLIC_NOTICE',
  INTERACTION = 'INTERACTION',
  SUPPORTING_DOC = 'SUPPORTING_DOC',
}
