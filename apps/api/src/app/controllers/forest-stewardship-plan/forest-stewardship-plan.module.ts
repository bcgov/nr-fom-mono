import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ForestStewardshipPlan } from './entities/forest-stewardship-plan.entity';
import { ForestStewardshipPlanService } from './forest-stewardship-plan.service';
import { ForestStewardshipPlanController, ForestStewardshipPlansController } from './forest-stewardship-plan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ForestStewardshipPlan])],
  controllers: [ForestStewardshipPlanController, ForestStewardshipPlansController],
  providers: [ForestStewardshipPlanService],
  exports: []
})
export class ForestStewardshipPlanModule {}
