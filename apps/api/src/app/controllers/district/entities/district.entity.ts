import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, Column } from 'typeorm';

@Entity('district', {schema: 'app_fom'})
export class District extends ApiBaseEntity<District> {
  constructor(district?: Partial<District>) {
    super(district);
  }

  @PrimaryColumn({name: 'district_id'})
  public id: number;

  @Column()
  name: string;

}
