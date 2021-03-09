import { ApiCodeTableEntity } from '../../../../core/entities/code.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('submission_type_code')
export class SubmissionTypeCode extends ApiCodeTableEntity<SubmissionTypeCode> {
  constructor(submissionTypeCode?: Partial<SubmissionTypeCode>) {
    super(submissionTypeCode);
  }
}
