import { ViewEntity, JoinColumn, Column, ManyToOne, ViewColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SubmissionTypeCode } from '../../submission-type-code/entities/submission-type-code.entity';

// This entity represents all the spatial objects (cut blocks, road sections, retention areas) for a FOM project
// denormalized and converted for easy rendering in leaflet.
@ViewEntity('project_spatial_detail', {schema: 'app_fom'})
export class ProjectSpatialDetail {

  constructor(projectSpatialDetail?: Partial<ProjectSpatialDetail>) {
    Object.assign(this, projectSpatialDetail);
  }

  @ViewColumn()
  @ApiProperty()
  object_id: number;

  @ViewColumn()
  @ApiProperty()
  source_table: string;

  @ViewColumn()
  @ApiProperty()
  name: string;

  // Loaded from DB as geojson string, converted to geojson object 
  @ViewColumn({name:"geojson"})
  @ApiProperty()
  geometry: object | string;

  @ViewColumn()
  @ApiProperty()
  planned_development_date: string;

  @ViewColumn()
  @ApiProperty()
  planned_area_ha: number;

  @ViewColumn()
  @ApiProperty()
  planned_length_km: number;

  @ViewColumn()
  @ApiProperty()
  submission_type_code: string;

  @ManyToOne(() => SubmissionTypeCode)
  @JoinColumn({ name: 'submission_type_code', referencedColumnName: 'code' })
  @ApiProperty()
  submission_type: SubmissionTypeCode;

  @Column()
  @ApiProperty()
  project_id: number;

}
