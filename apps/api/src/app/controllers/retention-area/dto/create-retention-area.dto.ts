import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';

export class CreateRetentionAreaDto extends BaseDto {
  @ApiProperty()
  geometry: any;
  @ApiProperty()
  plannedAreaHa: number;
  // Relationships
  @ApiProperty()
  submissionId: number;
}
