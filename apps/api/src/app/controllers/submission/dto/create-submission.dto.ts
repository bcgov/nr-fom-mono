import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';

export class CreateSubmissionDto extends BaseDto {
  @ApiProperty()
  geometry: any;
  // Relationships
  @ApiProperty()
  projectId: number;
  @ApiProperty()
  submissionTypeCode: string;
}
