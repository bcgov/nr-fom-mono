import { BaseDto } from '../../../../core/dto/base.dto';

export class CreateProjectDto extends BaseDto {
  name: string;
  description: string;
  commentingOpenDate: string; // timestamp
  commentingClosedDate: string; // timestamp
  // Relationships
  fspId: number;
  districtId: number;
  forestClientId: number;
  workflow_state_code: string;
}
