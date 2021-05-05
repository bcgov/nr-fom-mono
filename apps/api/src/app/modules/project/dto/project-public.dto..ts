import { ApiProperty } from '@nestjs/swagger';
import { FomPoint } from './project.dto';

// DTO optimized for Public FE map view
export class ProjectPublicSummaryDto {
  @ApiProperty()
  public id: number;
  @ApiProperty()
  name: string;
  @ApiProperty({example: ` { "type": "Point", "coordinates": [-119.396071939, 49.813816629]}`})
  geojson: FomPoint;
  @ApiProperty()
  forestClientName: string;
  @ApiProperty()
  workflowStateName: string;
  @ApiProperty()
  commentingOpenDate: string;
}
