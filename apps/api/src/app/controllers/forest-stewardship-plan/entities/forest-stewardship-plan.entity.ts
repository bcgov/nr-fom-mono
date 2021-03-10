import { ApiBaseEntity } from '@entities';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('forest_stewardship_plan')
export class ForestStewardshipPlan extends ApiBaseEntity<ForestStewardshipPlan> {
  constructor(forestStewardshipPlan?: Partial<ForestStewardshipPlan>) {
    super(forestStewardshipPlan);
  }
}
