import { ApiProperty } from '@nestjs/swagger';
import { SubmissionDto } from './submission.dto';

export class SubmissionWithJsonDto extends SubmissionDto {
  @ApiProperty()
  spatialObjectCode: ["CUT_BLOCK", "ROAD_SECTION", "WTRA"];
  
  @ApiProperty()
  jsonSpatialSubmission: string;
}
