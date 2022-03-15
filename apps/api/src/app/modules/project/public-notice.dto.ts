import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, MaxLength } from 'class-validator';
import { ProjectResponse } from './project.dto';

export class PublicNoticeCreateRequest {
  // TODO: Determine Max lengths

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  @MaxLength(500) 
  reviewAddress: string;

  @ApiProperty()
  @MaxLength(100) 
  reviewBusinessHours: string;

  @ApiProperty()
  @MaxLength(500) 
  @IsOptional()
  receiveCommentsAddress: string;

  @ApiProperty()
  @MaxLength(100) 
  @IsOptional()
  receiveCommentsBusinessHours: string;

  @ApiProperty()
  @IsBoolean()
  isReceiveCommentsSameAsReview: boolean;

  @ApiProperty()
  @MaxLength(100) 
  mailingAddress: string;

  @ApiProperty()
  @MaxLength(100) 
  email: string;
  
}

export class PublicNoticeUpdateRequest extends PublicNoticeCreateRequest {

  @ApiProperty()
  @IsNumber()
  revisionCount: number;

}

export class PublicNoticeResponse extends PublicNoticeUpdateRequest {

  @ApiProperty()
  id: number;

}

// DTO optimized for Public front-end
export class PublicNoticePublicFrontEndResponse extends PublicNoticeCreateRequest {

  // TODO: Add more columns (inherited from Project, or directly include ProjectResponse?)
  // TODO: Consider adding ValidityEndDate to ProjectResponse

  @ApiProperty()
  project: ProjectResponse;

}
