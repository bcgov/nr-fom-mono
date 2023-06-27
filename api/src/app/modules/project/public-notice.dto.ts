import { DateTimeUtil } from '@api-core/dateTimeUtil';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, MaxLength, Min, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { ProjectResponse, IsGreaterOrEqualTo } from './project.dto';

export class PublicNoticeCreateRequest {

  @ApiProperty()
  @IsNumber()
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

  @ApiProperty({ required: true })
  @IsNumber()
  @Min(DateTimeUtil.now(DateTimeUtil.TIMEZONE_VANCOUVER).year())
  operationStartYear: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsGreaterOrEqualTo('operationStartYear', {
    message: "Must be equal to or later than the Start of Operations",
  })
  operationEndYear: number;
}

export class PublicNoticePublicFrontEndResponse extends PublicNoticeCreateRequest {

  @ApiProperty()
  project: ProjectResponse;

}