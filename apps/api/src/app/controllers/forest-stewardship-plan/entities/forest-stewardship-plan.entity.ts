
import { ApiBaseEntity } from '@entities';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('forest_stewardship_plan', {schema: 'app_fom'})
export class ForestStewardshipPlan extends ApiBaseEntity<ForestStewardshipPlan> {
  constructor(forestStewardshipPlan?: Partial<ForestStewardshipPlan>) {
    super(forestStewardshipPlan);
  }

  @PrimaryColumn({name: 'forest_stewardship_plan_id'})
  public id: number;

}

