import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { SubmissionTypeCode } from "../submission/submission-type-code.entity";

export class SpatialFeaturePublicResponse {

    @ApiResponseProperty({ enum: ['cut_block', 'road_section', 'retention_area']})
    featureType: string;

    @ApiResponseProperty()
    featureId: number;

    @ApiResponseProperty()
    name: string;

    @ApiResponseProperty({ format: 'GeoJSON Geometry' })
    geometry: object;

    @ApiResponseProperty({ format: 'YYYY-MM-DD'})
    plannedDevelopmentDate: string;
  
    @ApiResponseProperty()
    plannedAreaHa: number;
  
    @ApiResponseProperty()
    plannedLengthKm: number;

    @ApiResponseProperty()
    submissionType: SubmissionTypeCode;    
 }

// Keep this BCGW API completely separated from the API used by FOM Public.
export class SpatialFeatureBcgwResponse {

    @ApiResponseProperty()
    fomId: number;
  
    @ApiResponseProperty({ enum: ['cut_block', 'road_section', 'retention_area']})
    featureType: string;

    @ApiResponseProperty()
    featureId: number;

    @ApiResponseProperty({ format: 'max length expected to be < 100'})
    fspHolderName: string;

    @ApiResponseProperty({ enum: ['Proposed', 'Final']})
    lifecycleStatus: string;
  
    @ApiResponseProperty({ format: 'YYYY-MM-DD'})
    createDate: string;

    @ApiResponseProperty({ format: 'GeoJSON Geometry', example: 'Cut Block / Retention Area Example: {"type":"Polygon","coordinates":[[[-121.652853481,51.67951884],[-121.499131212,51.763467947],[-121.363845891,51.668139701],[-121.373301212,51.578595415],[-121.661722435,51.589952346],[-121.652853481,51.67951884]]]} Road Section Example: {"type":"LineString","coordinates":[[-124.667049923,52.651503193],[-124.739768473,52.697146151],[-124.816364174,52.60827305]]}'})
    geometry: object;

    @ApiResponseProperty({ format: 'YYYY-MM-DD'})
    plannedDevelopmentDate: string;
  
    @ApiResponseProperty()
    plannedAreaHa: number;
  
    @ApiResponseProperty()
    plannedLengthKm: number;
  
}