import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';
import { District } from '../../district/entities/district.entity';
import { ForestClient } from '../../forest-client/entities/forest-client.entity';
import { WorkflowStateCode } from '../../workflow-state-code/entities/workflow-state-code.entity';
import { Point } from 'geojson';


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
  district: District;
  @ApiProperty()
  forestClientNumber: string;
  @ApiProperty()
  forestClient: ForestClient;
  @ApiProperty()
  workflowStateCode: string;
  @ApiProperty()
  workflowState: WorkflowStateCode;
}

export interface FomPoint extends Point {
  // Need to do this to get to compile, rather than using Point directly. Not sure why...
}
