import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';
import { Project } from '../../project/entities/project.entity';
import { ResponseCode } from '../../response-code/entities/response-code.entity';

export class CreatePublicCommentDto extends BaseDto {
  @ApiProperty()
  feedback: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  location: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  responseDetails: string;
  // Relationships
  @ApiProperty()
  projectId: number;
  @ApiProperty()
  project: Project;
  @ApiProperty()
  responseCode: string;
  @ApiProperty()
  response: ResponseCode;
}
