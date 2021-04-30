import { ApiProperty } from '@nestjs/swagger';
import { SubmissionDto } from './submission.dto';
import { FeatureCollection } from 'geojson';

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

export class SubmissionWithJsonDto extends SubmissionDto {
  @ApiProperty({ enum: SpatialObjectCodeEnum, enumName: 'SpatialObjectCodeEnum'})
  spatialObjectCode: SpatialObjectCodeEnum;
  
  @ApiProperty()
  jsonSpatialSubmission: FomSpatialJson;

}
