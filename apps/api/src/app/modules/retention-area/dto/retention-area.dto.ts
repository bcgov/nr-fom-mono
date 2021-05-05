import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';

export class RetentionAreaDto extends BaseDto {
  @ApiProperty()
  geometry: any;
  @ApiProperty()
  plannedAreaHa: number;
  // Relationships
  @ApiProperty()
  submissionId: number;
}
