import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SubmissionDto } from './submission.dto';
import { FeatureCollection } from 'geojson';
import { IsJSON, IsNotEmpty } from 'class-validator';

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

// export class SubmissionWithJsonDto extends SubmissionDto {
export class SubmissionWithJsonDto extends OmitType(SubmissionDto, 
  // TODO: perhaps, it is better to create a new "createDTO" with below annotations there and extends from that DTO.
  ['id', 'revisionCount', 'createTimestamp', 'createUser', 'updateTimestamp', 'updateUser', 'project', 'submissionType']) {
  @ApiProperty({ enum: SpatialObjectCodeEnum, enumName: 'SpatialObjectCodeEnum'})
  @IsNotEmpty()
  spatialObjectCode: SpatialObjectCodeEnum;
  
  @ApiProperty()
  @IsNotEmpty()
  jsonSpatialSubmission: FomSpatialJson;

}
