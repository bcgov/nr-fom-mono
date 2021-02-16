import { BaseDto } from '../../../../core/dto/base.dto';

export class CreateRetentionAreaDto extends BaseDto {
  geometry: any;
  plannedAreaHa: number;
  // Relationships
  submissionId: number;
}
