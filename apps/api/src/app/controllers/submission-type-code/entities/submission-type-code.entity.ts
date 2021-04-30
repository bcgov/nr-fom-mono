import { ApiCodeTableEntity } from '@entities';
import { Entity } from 'typeorm';

@Entity('submission_type_code', { schema: 'app_fom' })
export class SubmissionTypeCode extends ApiCodeTableEntity<SubmissionTypeCode> {
  constructor(submissionTypeCode?: Partial<SubmissionTypeCode>) {
    super(submissionTypeCode);
  }
}

export enum SubmissionTypeCodeEnum {
  PROPOSED = 'PROPOSED',
  FINAL = 'FINAL'
};
