import { ApiCodeTableEntity } from '@entities';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('response_code')
export class ResponseCode extends ApiCodeTableEntity<ResponseCode> {
  constructor(responseCode?: Partial<ResponseCode>) {
    super(responseCode);
  }
}
