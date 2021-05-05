import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';

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
