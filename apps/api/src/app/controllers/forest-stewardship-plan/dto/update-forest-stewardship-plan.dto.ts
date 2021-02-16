import { PartialType } from '@nestjs/mapped-types';
import { CreateForestStewardshipPlanDto } from './create-forest-stewardship-plan.dto';

export class UpdateForestStewardshipPlanDto extends PartialType(CreateForestStewardshipPlanDto) {}
