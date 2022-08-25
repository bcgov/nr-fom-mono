import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, MaxLength, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
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
  operationStartYear: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotLessThan('operationStartYear', {
    message: "[Operation End Year] must be the same or after [Operation Start Year]",
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
 * Custom validation decorator: @IsNotLessThan - check number_1 >= number_2
 */
export function IsNotLessThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotLessThan',
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