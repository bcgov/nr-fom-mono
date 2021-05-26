import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BaseDto } from '@dto';

// TODO: Need Request/Response objects.
export class InteractionDto extends BaseDto {
  @ApiProperty()
  stakeholder: string;
  @ApiProperty()
  communicationDate: string; // timestamp
  @ApiProperty()
  communicationDetails: string;
  // Relationships
  @ApiProperty()
  projectId: number;
  @ApiProperty()
  attachmentId: number;
}

export class UpdateInteractionDto extends OmitType(InteractionDto, ['id']) {}