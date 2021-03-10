import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../../../../core/dto/base.dto';

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
  forestClientId: number;
  @ApiProperty()
  workflow_state_code: string;
}
