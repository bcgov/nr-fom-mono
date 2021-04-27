import { ApiProperty } from '@nestjs/swagger';
import { SubmissionDto } from './submission.dto';
import { FeatureCollection } from 'geojson'

export class SubmissionWithJsonDto extends SubmissionDto {
  @ApiProperty()
  spatialObjectCode: SpatialObjectCodeEnum;
  
  @ApiProperty()
  jsonSpatialSubmission: FomSpatialJson;

}

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
