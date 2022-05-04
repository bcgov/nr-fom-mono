import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SpatialFeaturePublicResponse } from '@api-client';
import { FeatureSelectService } from '@public-core/services/featureSelect.service';

@Component({
  selector: 'app-shape-info',
  templateUrl: './shape-info.component.html',
  styleUrls: ['./shape-info.component.scss']
})
export class ShapeInfoComponent implements OnInit {

  slideColor: ThemePalette = 'primary';
  displayedColumns: string[] = ['shape_id', 'type', 'name', 'submission_type', 'area_length', 'development_date'];
  selectedRowIndex: string = null;

  @Input('spatialDetail')
  projectSpatialDetail: SpatialFeaturePublicResponse[];

  constructor(private fss: FeatureSelectService) { 
    // Deliberately empty
  }

  ngOnInit(): void {
    // Deliberately empty
  }

  onRowSelected(rowData) {
    this.selectedRowIndex = rowData.featureId + '-' + rowData.featureType.code; // Unique when featureType is included.
    this.fss.changeSelectedFeature(this.selectedRowIndex);
  }
}
