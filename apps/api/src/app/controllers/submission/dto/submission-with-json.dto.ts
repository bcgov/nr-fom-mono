import { ApiProperty } from '@nestjs/swagger';
import { FeatureCollection } from 'geojson';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { SubmissionTypeCodeEnum } from '../../submission-type-code/entities/submission-type-code.entity';

// Using GeoJSON types, won't have the API documentation but that's okay.
export interface FomSpatialJson extends FeatureCollection {
  crs: { 
    type: "name", 
    properties: { "name": "EPSG:3005" }
  }
}

export enum SpatialObjectCodeEnum {
  CUT_BLOCK = 'CUT_BLOCK',
  ROAD_SECTION = 'ROAD_SECTION',
  WTRA = 'WTRA'
};

export class SubmissionWithJsonDto {
  @ApiProperty()
  @IsNotEmpty()
  projectId: number;

  @ApiProperty({ enum: SubmissionTypeCodeEnum, enumName: 'SubmissionTypeCodeEnum'})
  @IsEnum(SubmissionTypeCodeEnum)
  submissionTypeCode: SubmissionTypeCodeEnum;
  
  @ApiProperty({ enum: SpatialObjectCodeEnum, enumName: 'SpatialObjectCodeEnum'})
  @IsNotEmpty()
  @IsEnum(SpatialObjectCodeEnum)
  spatialObjectCode: SpatialObjectCodeEnum;
  
  @ApiProperty()
  @IsNotEmpty()
  jsonSpatialSubmission: FomSpatialJson;

}
