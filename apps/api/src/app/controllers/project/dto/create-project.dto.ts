import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';

export class CreateProjectDto extends BaseDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  commentingOpenDate: string; // timestamp
  @ApiProperty()
  commentingClosedDate: string; // timestamp
  // Relationships
  @ApiProperty()
  fspId: number;
  @ApiProperty()
  districtId: number;
  @ApiProperty()
  forestClientNumber: string;
  @ApiProperty()
  workflowStateCode: string;
}
