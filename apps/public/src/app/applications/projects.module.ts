import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

// Modules
import { SharedModule } from '../shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';

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
import { PublicNoticesPanelComponent } from './app-public-notices/public-notices-panel.component';
import { ShortenPipe } from '@public-core/pipes/shorten.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    NgbModule, 
    RouterModule, 
    SharedModule,
    BrowserAnimationsModule,
    MatTableModule, 
    MatSlideToggleModule,
    MatExpansionModule,
    MatCardModule,
    MatTooltipModule,
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
    ShapeInfoComponent,
    PublicNoticesPanelComponent,
    ShortenPipe
  ]
})
export class ProjectsModule {}
