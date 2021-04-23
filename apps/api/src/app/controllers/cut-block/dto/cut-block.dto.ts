import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';

export class CutBlockDto extends BaseDto {
  @ApiProperty()
  geometry: any;
  @ApiProperty()
  plannedDevelopmentDate: string; // timestamp
  @ApiProperty()
  name: string;
  @ApiProperty()
  plannedAreaHa: number;
  // Relationships
  @ApiProperty()
  submissionId: number;
}
