import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';
import { Project } from '../../project/entities/project.entity';
import { SubmissionTypeCode } from '../../submission-type-code/entities/submission-type-code.entity';

export class SubmissionDto extends BaseDto {

  // Relationships
  @ApiProperty()
  projectId: number;
  @ApiProperty()
  project: Project;
  @ApiProperty()
  submissionTypeCode: string;
  @ApiProperty()
  submissionType: SubmissionTypeCode;
}
