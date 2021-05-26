import { ApiProperty, OmitType } from '@nestjs/swagger';

// TODO: Need Request/Response objects.
export class InteractionDto {
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

export class UpdateInteractionDto extends InteractionDto {}