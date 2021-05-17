import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';
import { WorkflowStateCode } from '../../workflow-state-code/entities/workflow-state-code.entity';
import { Point } from 'geojson';
import { DistrictDto } from '../../district/dto/district.dto';
import { ForestClientDto } from '../../forest-client/dto/forest-client.dto';

export class ProjectDto extends BaseDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  commentingOpenDate: string; // timestamp
  @ApiProperty()
  commentingClosedDate: string; // timestamp
  @ApiProperty({example: ` { "type": "Point", "coordinates": [-119.396071939, 49.813816629]}`})
  geojson: FomPoint;
  // Relationships
  @ApiProperty()
  fspId: number;
  @ApiProperty()
  districtId: number;
  @ApiProperty()
  district: DistrictDto;
  @ApiProperty()
  forestClientNumber: string;
  @ApiProperty()
  forestClient: ForestClientDto;
  @ApiProperty()
  workflowStateCode: string;
  @ApiProperty()
  workflowState: WorkflowStateCode;
}

// Need to do this to get to compile, rather than using Point directly. Not sure why...
export interface FomPoint extends Point {

}
