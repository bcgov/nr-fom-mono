import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@dto';
import { Project } from '../../project/entities/project.entity';
import { ResponseCode, ResponseCodeEnum } from '../../response-code/entities/response-code.entity';
import { CommentScopeCode, CommentScopeCodeEnum } from '../../comment-scope-code/entities/comment-scope-code.entity';
import { IsDefined, IsEmail, IsEnum, IsNotEmptyObject, IsNumber, IsOptional, IsPhoneNumber, MaxLength, MinLength } from 'class-validator';

// Since this is submitted by public who might be malicious, need to ensure maximums are defined for every property.
export class PublicCommentCreateRequest {
  @ApiProperty()
  @IsNumber()
  projectId: number;

  @ApiProperty()
  @IsEnum(CommentScopeCodeEnum)
  commentScopeCode: string;

  @ApiProperty()
  @IsOptional()
  scopeCutBlockId?: number;

  @ApiProperty()
  @IsOptional()
  scopeRoadSectionId?: number;

  @ApiProperty()
  @MaxLength(4000)
  @MinLength(1) // TODO: Confirm min & max lengths. Min should be longer than 1.
  feedback: string;

  @ApiProperty()
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @ApiProperty()
  @MaxLength(50)
  @IsOptional()
  location?: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(256) // Maximum allowed by Internet RFC.
  @IsEmail()
  email?: string;

  @ApiProperty()
  @MaxLength(50)
  @IsOptional()
  phoneNumber?: string;
}

export class PublicCommentAdminUpdateRequest {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  revisionCount: number;

  @ApiProperty()
  @IsEnum(ResponseCodeEnum)
  responseCode: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(4000)
  responseDetails?: string;
}

export class PublicCommentAdminResponse extends PublicCommentCreateRequest {
  @ApiProperty()
  id: number;
  @ApiProperty()
  revisionCount: number;
  @ApiProperty()
  createTimestamp: string;
  @ApiProperty()
  commentScope: CommentScopeCode;
  @ApiProperty()
  scopeCutBlockId: number;
  @ApiProperty()
  scopeRoadSectionId: number;
  @ApiProperty()
  response?: ResponseCode;
  @ApiProperty()
  responseDetails?: string;
}

