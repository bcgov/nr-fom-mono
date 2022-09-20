import { DateTimeUtil } from '@api-core/dateTimeUtil';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, MaxLength, Min, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { ProjectResponse } from './project.dto';

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
  
  @ApiProperty({ required: true })
  @IsNumber()
  @Min(DateTimeUtil.now(DateTimeUtil.TIMEZONE_VANCOUVER).year())
  operationStartYear: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsGreaterOrEqualTo('operationStartYear', {
    message: "Must be equal to or later than the Proposed Start of Operations",
  })
  operationEndYear: number;
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

export class PublicNoticePublicFrontEndResponse extends PublicNoticeCreateRequest {

  @ApiProperty()
  project: ProjectResponse;

}

/**
 * Custom validation decorator: @IsGreaterOrEqualTo - check number_1 >= number_2
 */
export function IsGreaterOrEqualTo(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterOrEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === 'number' 
              && typeof relatedValue === 'number' 
              && value >= relatedValue;
        },
      },
    });
  };
}