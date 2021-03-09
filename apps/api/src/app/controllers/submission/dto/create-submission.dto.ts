import { BaseDto } from '../../../../core/dto/base.dto';

export class CreateSubmissionDto extends BaseDto {
  geometry: any;
  // Relationships
  projectId: number;
  submissionTypeCode: string;
}
