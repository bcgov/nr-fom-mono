import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BaseDto } from '@dto';
import { WorkflowStateCode } from './workflow-state-code.entity';
import { Point } from 'geojson';
import { DistrictResponse } from '../district/district.dto';
import { ForestClientResponse } from '../forest-client/forest-client.dto';

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
  district: DistrictResponse;
  @ApiProperty()
  forestClientNumber: string;
  @ApiProperty()
  forestClient: ForestClientResponse;
  @ApiProperty()
  workflowStateCode: string;
  @ApiProperty()
  workflowState: WorkflowStateCode;
}

// DTO optimized for Public FE map view
export class ProjectPublicSummaryDto {
  @ApiProperty()
  public id: number;
  @ApiProperty()
  name: string;
  @ApiProperty({example: ` { "type": "Point", "coordinates": [-119.396071939, 49.813816629]}`})
  geojson: FomPoint;
  @ApiProperty()
  fspId: number;
  @ApiProperty()
  forestClientName: string;
  @ApiProperty()
  workflowStateName: string;
  @ApiProperty()
  commentingOpenDate: string;
}

export class UpdateProjectDto extends OmitType(ProjectDto, ['id']) {}

// Need to do this to get to compile, rather than using Point directly. Not sure why...
export interface FomPoint extends Point {

}
