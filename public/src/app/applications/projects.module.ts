import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

// Modules
import { SharedModule } from '../shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

// Components
import { ProjectsComponent } from './projects.component';
import { AppMapComponent } from './app-map/app-map.component';
import { MarkerPopupComponent } from './app-map/marker-popup/marker-popup.component';
import { DetailsPanelComponent } from './details-panel/details-panel.component';
import { DetailsMapComponent } from './details-panel/details-map/details-map.component';
import { DateInputComponent } from './utils/date-input/date-input.component';
import { FindPanelComponent } from './find-panel/find-panel.component';
import { SplashModalComponent } from './splash-modal/splash-modal.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { ShapeInfoComponent } from './details-panel/shape-info/shape-info.component';
import { PublicNoticesPanelComponent } from './app-public-notices/public-notices-panel.component';
import { ShortenPipe } from '@public-core/pipes/shorten.pipe';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PublicNoticesFilterPanelComponent } from './app-public-notices/notices-filter-panel/public-notices-filter-panel.component';

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
    PublicNoticesFilterPanelComponent,
    ShortenPipe
  ]
})
export class ProjectsModule {}
