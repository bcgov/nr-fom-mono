import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { FeatureCollection } from 'geojson';
import { SubmissionTypeCodeEnum } from './submission-type-code.entity';

// Using GeoJSON types, won't have the API documentation but that's okay.
export interface FomSpatialJson extends FeatureCollection {
  crs?: { 
    type: "name", 
    // Only these formats/values (short/long) for supplied spatial submission are accepted.
    properties: { "name": "EPSG:3005" | "urn:ogc:def:crs:EPSG::3005" | 
                          "EPSG:4326" | "urn:ogc:def:crs:EPSG::4326" }
  }
}

export enum SpatialObjectCodeEnum {
  CUT_BLOCK = 'CUT_BLOCK',
  ROAD_SECTION = 'ROAD_SECTION',
  WTRA = 'WTRA'
}

export enum SpatialCoordSystemEnum {
  BC_ALBERS = 3005, //EPSG:3005
  WGS84 = 4326 // EPSG:4326
}

export class SubmissionRequest {
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

export type SubmissionSpatialObjectMetrics = {
  id: number,
  name?: string,
  spatialObjectCode: SpatialObjectCodeEnum,
}

export class SubmissionMetricsResponse {

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  submissionId: number;

  @ApiProperty({ 
    enum: SubmissionTypeCodeEnum, 
    enumName: 'SubmissionTypeCodeEnum',
    example: SubmissionTypeCodeEnum.PROPOSED,
    default: SubmissionTypeCodeEnum.PROPOSED
  })
  submissionTypeCode: SubmissionTypeCodeEnum;

  @ApiProperty({type: () => [SubmissionMetricsResponse]})
  cutblocks: Array<SubmissionSpatialObjectMetrics>;

  @ApiProperty({type: () => [SubmissionMetricsResponse]})
  roadSections: Array<SubmissionSpatialObjectMetrics>;

  @ApiProperty({type: () => [SubmissionMetricsResponse]})
  retentionAreas: Array<SubmissionSpatialObjectMetrics>;
}
