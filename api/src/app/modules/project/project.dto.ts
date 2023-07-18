import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { DateTimeUtil } from '@api-core/dateTimeUtil';
import { WorkflowStateCode, WorkflowStateEnum } from './workflow-state-code.entity';
import { Point } from 'geojson';
import { DistrictResponse } from '../district/district.dto';
import { ForestClientResponse } from '../forest-client/forest-client.dto';
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsNumberString, IsOptional, MaxLength, 
  MinLength, Min, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export class ProjectCreateRequest {
  @ApiProperty()
  @MaxLength(50) 
  @MinLength(5) 
  name: string;

  @ApiProperty()
  @MaxLength(500) 
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ISO-formatted date'})
  @IsOptional()
  @IsDateString()
  commentingOpenDate?: string;

  @ApiProperty({ description: 'ISO-formatted date'})
  @IsOptional()
  @IsDateString()
  commentingClosedDate?: string; 

  @ApiProperty()
  @IsNumberString()
  forestClientNumber: string;

  @ApiProperty()
  @IsNumber()
  fspId: number;

  @ApiProperty()
  @IsNumber()
  districtId: number;

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

export class ProjectUpdateRequest extends OmitType(PartialType(ProjectCreateRequest), ['forestClientNumber']) {
  // forestClientNumber is the basis for security controls so cannot be changed on updates.
  // workflow state can only be changed via special requests, not via a project update request.

  @ApiProperty()
  @IsNumber()
  revisionCount: number;
}

export class ProjectWorkflowStateChangeRequest {
  @ApiProperty()
  @IsNumber()
  revisionCount: number;

  @ApiProperty({enum: WorkflowStateEnum, enumName: 'WorkflowStateEnum'})
  @IsEnum(WorkflowStateEnum)
  workflowStateCode: string;
}

// DTO optimized for Public FE map view
export class ProjectPublicSummaryResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({example: ` { "type": "Point", "coordinates": [-119.396071939, 49.813816629]}`})
  geojson: FomPoint;

  @ApiProperty()
  fspId: number;

  @ApiProperty()
  forestClientName: string;

  @ApiProperty()
  workflowStateName: string;

}

export class ProjectResponse {

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ description: 'ISO-formatted date'})
  commentingOpenDate: string;

  @ApiProperty({ description: 'ISO-formatted date'})
  commentingClosedDate: string; 

  @ApiProperty({ description: 'ISO-formatted date'})
  validityEndDate: string

  @ApiProperty()
  fspId: number;

  @ApiProperty()
  district: DistrictResponse;

  @ApiProperty()
  forestClient: ForestClientResponse;

  @ApiProperty()
  workflowState: WorkflowStateCode;

  @ApiProperty()
  revisionCount: number;

  @ApiProperty({ description: 'ISO-formatted timestamp'})
  createTimestamp: string;

  @ApiProperty({default: true})
  commentClassificationMandatory: boolean;

  @ApiProperty()
  publicNoticeId: number; // Online Public Notice (if any)

  @ApiProperty()
  noticePostDate?: string;

  @ApiProperty({ required: true })
  operationStartYear: number;

  @ApiProperty({ required: true })
  operationEndYear: number;
}

export class ProjectMetricsResponse {

  @ApiProperty()
  id: number;

  @ApiProperty()
  totalInteractionsCount: number;

  @ApiProperty()
  totalCommentsCount: number;

  @ApiProperty()
  respondedToCommentsCount: number;
}

// Need to do this to get to compile, rather than using Point directly. Not sure why...
export interface FomPoint extends Point {

}
export class ProjectCommentClassificationMandatoryChangeRequest {
    @ApiProperty()
    @IsBoolean()
    commentClassificationMandatory: boolean;
  
    @ApiProperty()
    @IsNumber()
    revisionCount: number;
}

export class ProjectCommentingClosedDateChangeRequest {
  @ApiProperty({ description: 'ISO-formatted date'})
  @IsDateString()
  commentingClosedDate: string;

  @ApiProperty()
  @IsNumber()
  revisionCount: number;
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