import { BaseDto } from '../../../../core/dto/base.dto';

export class CreateInteractionDto extends BaseDto {
  stakeholder: string;
  communicationDate: string; // timestamp
  communicationDetails: string;
  // Relationships
  projectId: number;
  attachmentId: number;
}
