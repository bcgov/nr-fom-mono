import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SpatialFeaturePublicResponse, SpatialObjectCodeEnum } from '@api-client';

@Component({
  selector: 'app-shape-info',
  templateUrl: './shape-info.component.html',
  styleUrls: ['./shape-info.component.scss']
})
export class ShapeInfoComponent implements OnInit {

  slideColor: ThemePalette = 'primary';
  displayedColumns: string[] = ['shape_id', 'type', 'name', 'submission_type', 'area_length', 'development_date'];

  @Input('spatialDetail')
  projectSpatialDetail: SpatialFeaturePublicResponse[];

  constructor() { 
    // Deliberately empty
  }

  ngOnInit(): void {
    // Deliberately empty
  }

}
