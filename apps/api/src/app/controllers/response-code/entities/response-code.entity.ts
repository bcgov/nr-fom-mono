import { ApiCodeTableEntity } from '../../../../core/entities/code.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('response_code')
export class ResponseCode extends ApiCodeTableEntity<ResponseCode> {
  constructor(responseCode?: Partial<ResponseCode>) {
    super(responseCode);
  }
}
