import { OmitType } from '@nestjs/swagger';
import { ForestStewardshipPlanDto } from './forest-stewardship-plan.dto';

export class UpdateForestStewardshipPlanDto extends OmitType(ForestStewardshipPlanDto, ['id']) {}
