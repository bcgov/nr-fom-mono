import { BaseDto } from '../../../../core/dto/base.dto';

export class CreateCutBlockDto extends BaseDto {
  geometry: any;
  plannedDevelopmentDate: string; // timestamp
  plannedAreaHa: number;
  // Relationships
  submissionId: number;
}
