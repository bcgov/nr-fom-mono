import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

// Modules
import { SharedModule } from '../shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// Components
import { ProjectsComponent } from './projects.component';
import { AppMapComponent } from './app-map/app-map.component';
import { MarkerPopupComponent } from './app-map/marker-popup/marker-popup.component';
import { DetailsPanelComponent } from './details-panel/details-panel.component';
import { DetailsMapComponent } from './details-panel/details-map/details-map.component';
import { DateInputComponent } from './utils/date-input/date-input.component';
import { FindPanelComponent } from './find-panel/find-panel.component';
import { SplashModalComponent } from './splash-modal/splash-modal.component';
import { MatTableModule } from '@angular/material/table'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ShapeInfoComponent } from './details-panel/shape-info/shape-info.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    NgbModule, 
    RouterModule, 
    SharedModule, 
    MatTableModule, 
    MatSlideToggleModule, 
    BsDatepickerModule.forRoot()],
  declarations: [
    ProjectsComponent,
    AppMapComponent,
    MarkerPopupComponent,
    DetailsPanelComponent,
    DetailsMapComponent,
    DateInputComponent,
    FindPanelComponent,
    SplashModalComponent,
    ShapeInfoComponent
  ]
})
export class ProjectsModule {}
