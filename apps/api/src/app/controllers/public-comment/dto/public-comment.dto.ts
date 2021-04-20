import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';
import { Project } from '../../project/entities/project.entity';
import { ResponseCode } from '../../response-code/entities/response-code.entity';
import { CommentScopeCode } from '../../comment-scope-code/entities/comment-scope-code.entity';

export class PublicCommentDto extends BaseDto {
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
  @ApiProperty()
  commentScopeCode: string;
  @ApiProperty()
  commentScope: CommentScopeCode;
  @ApiProperty()
  scopeCutBlockId: number;
  @ApiProperty()
  scopeRoadSectionId: number;
}
