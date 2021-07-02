import { ApiCodeTableEntity } from '@entities';
import { Entity } from 'typeorm';

@Entity('response_code', {schema: 'app_fom'})
export class ResponseCode extends ApiCodeTableEntity<ResponseCode> {
  constructor(responseCode?: Partial<ResponseCode>) {
    super(responseCode);
  }
}

export enum ResponseCodeEnum {
  IRRELEVANT = 'IRRELEVANT',
  CONSIDERED = 'CONSIDERED',
  ADDRESSED = 'ADDRESSED',
}
