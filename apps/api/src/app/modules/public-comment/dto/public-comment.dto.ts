import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';
import { Project } from '../../project/entities/project.entity';
import { ResponseCode } from '../../response-code/entities/response-code.entity';
import { CommentScopeCode } from '../../comment-scope-code/entities/comment-scope-code.entity';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class PublicCommentDto extends BaseDto {

  @MaxLength(4000)
  @ApiProperty()
  feedback: string;

  @IsOptional()
  @MaxLength(50)
  @ApiProperty()
  name: string;

  @IsOptional()
  @MaxLength(50)
  @ApiProperty()
  location: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  responseDetails: string;

  @IsNotEmpty()
  @ApiProperty()
  projectId: number;

  @ApiProperty()
  project: Project;

  @ApiProperty()
  responseCode: string;

  @ApiProperty()
  response: ResponseCode;

  @IsNotEmpty()
  @ApiProperty()
  commentScopeCode: string;

  @ApiProperty()
  commentScope: CommentScopeCode;

  @ApiProperty()
  scopeCutBlockId: number;

  @ApiProperty()
  scopeRoadSectionId: number;
}
