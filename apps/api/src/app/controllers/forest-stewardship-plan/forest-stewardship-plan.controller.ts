import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../core/controllers/base.controller';
import { ForestStewardshipPlanService } from './forest-stewardship-plan.service';
import { ForestStewardshipPlan } from './entities/forest-stewardship-plan.entity';
import { CreateForestStewardshipPlanDto } from './dto/create-forest-stewardship-plan.dto';
import { UpdateForestStewardshipPlanDto } from './dto/update-forest-stewardship-plan.dto';

@ApiTags('forest-stewardship-plan')
@Controller('forest-stewardship-plan')
export class ForestStewardshipPlanController extends BaseController<
  ForestStewardshipPlan,
  CreateForestStewardshipPlanDto,
  UpdateForestStewardshipPlanDto
> {
  constructor(protected readonly service: ForestStewardshipPlanService) {
    super(service);
  }
}
