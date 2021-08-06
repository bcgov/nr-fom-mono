import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SpatialFeaturePublicResponse, SpatialObjectCodeEnum } from '@api-client';
import { SpatialTypeMap } from '@public-core/utils/constants/appUtils';

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

  getFomSpatialTypeDesc(source: string) {
    switch(source) {
      case SpatialTypeMap.get(SpatialObjectCodeEnum.CutBlock)['source'].toLowerCase():
        return SpatialTypeMap.get(SpatialObjectCodeEnum.CutBlock)['desc'];

      case SpatialTypeMap.get(SpatialObjectCodeEnum.RoadSection)['source'].toLowerCase():
        return SpatialTypeMap.get(SpatialObjectCodeEnum.RoadSection)['desc'];

      case SpatialTypeMap.get(SpatialObjectCodeEnum.Wtra)['source'].toLowerCase():
        return SpatialTypeMap.get(SpatialObjectCodeEnum.Wtra)['desc'];
        
      default:
        return null;
    }
  }

}
