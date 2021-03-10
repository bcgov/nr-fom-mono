import { OmitType } from '@nestjs/swagger';
import { CreateForestStewardshipPlanDto } from './create-forest-stewardship-plan.dto';

export class UpdateForestStewardshipPlanDto extends OmitType(CreateForestStewardshipPlanDto, ['id']) {}
