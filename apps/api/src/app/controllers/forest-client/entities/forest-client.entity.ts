import { ApiBaseEntity } from '@entities';
import { Entity, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, Column } from 'typeorm';

@Entity('forest_client', {schema: 'app_fom'})
export class ForestClient extends ApiBaseEntity<ForestClient> {
  constructor(forestClient?: Partial<ForestClient>) {
    super(forestClient);
  }

  @PrimaryColumn({name: 'forest_client_number'})
  public id: string;

  @Column()
  name: string;


}
