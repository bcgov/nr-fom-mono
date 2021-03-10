import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../core/dto/base.dto';

export class CreateCutBlockDto extends BaseDto {
  @ApiProperty()
  geometry: any;
  @ApiProperty()
  plannedDevelopmentDate: string; // timestamp
  @ApiProperty()
  plannedAreaHa: number;
  // Relationships
  @ApiProperty()
  submissionId: number;
}
