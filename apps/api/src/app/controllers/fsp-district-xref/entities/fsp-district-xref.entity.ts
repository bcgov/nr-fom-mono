import { ApiBaseEntity } from '@entities';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('fsp_district_xref', {schema: 'app_fom'})
export class FspDistrictXref extends ApiBaseEntity<FspDistrictXref> {
  constructor(fspDistrictXref?: Partial<FspDistrictXref>) {
    super(fspDistrictXref);
  }

  @PrimaryColumn({name: 'fsp_district_xref_id'})
  public id: number;


}
