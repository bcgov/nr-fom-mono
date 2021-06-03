import { ViewEntity, JoinColumn, ManyToOne, ViewColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SubmissionTypeCode } from '../submission/submission-type-code.entity';

// This entity represents all the spatial objects (cut blocks, road sections, retention areas) for a FOM project
// denormalized and converted for easy rendering in leaflet.
@ViewEntity('project_spatial_detail', {schema: 'app_fom'})
export class ProjectSpatialDetail {

  constructor(projectSpatialDetail?: Partial<ProjectSpatialDetail>) {
    Object.assign(this, projectSpatialDetail);
  }

  @ViewColumn({name: 'object_id'})
  @ApiProperty()
  objectId: number;

  @ViewColumn({name: 'source_table'})
  @ApiProperty()
  sourceTable: string;

  @ViewColumn()
  @ApiProperty()
  name: string;

  // Loaded from DB as geojson string, converted to geojson object 
  @ViewColumn({name:"geojson"})
  @ApiProperty()
  geometry: object | string;

  @ViewColumn({name: 'planned_development_date'})
  @ApiProperty()
  plannedDevelopmentDate: string;

  @ViewColumn({name: 'planned_area_ha'})
  @ApiProperty()
  plannedAreaHa: number;

  @ViewColumn({name: 'planned_length_km'})
  @ApiProperty()
  plannedLengthKm: number;

  @ManyToOne(() => SubmissionTypeCode)
  @JoinColumn({ name: 'submission_type_code', referencedColumnName: 'code' })
  @ApiProperty()
  submissionType: SubmissionTypeCode;

  @ViewColumn({name: 'project_id'})
  @ApiProperty()
  projectId: number;

}
