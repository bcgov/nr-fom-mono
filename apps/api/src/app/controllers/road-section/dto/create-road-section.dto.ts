import { BaseDto } from '../../../../core/dto/base.dto';

export class CreateRoadSectionDto extends BaseDto {
  geometry: any;
  plannedDevelopmentDate: string; // timestamp
  plannedLengthKm: number;
  // Relationships
  submissionId: number;
}
