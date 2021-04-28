import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';
import { Project } from '../../project/entities/project.entity';
import { SubmissionTypeCode, SubmissionTypeCodeEnum } from '../../submission-type-code/entities/submission-type-code.entity';

export class SubmissionDto extends BaseDto {

  // Relationships
  @ApiProperty()
  projectId: number;
  @ApiProperty()
  project: Project;
  @ApiProperty({ enum: SubmissionTypeCodeEnum, enumName: 'SubmissionTypeCodeEnum'})
  submissionTypeCode: SubmissionTypeCodeEnum;
  @ApiProperty()
  submissionType: SubmissionTypeCode;
}
