import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Modules
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// Components
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShortenPipe } from '@public-core/pipes/shorten.pipe';
import { AppMapComponent } from 'app/applications/app-map/app-map.component';
import { PublicNoticesPanelComponent } from 'app/applications/app-public-notices/public-notices-panel.component';
import { FindPanelComponent } from 'app/applications/find-panel/find-panel.component';
import { PublicNoticesFilterPanelComponent } from './app-public-notices/notices-filter-panel/public-notices-filter-panel.component';
import { DetailsPanelComponent } from './details-panel/details-panel.component';
import { ProjectsComponent } from './projects.component';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    NgbModule, 
    RouterModule,
    BrowserAnimationsModule,
    MatTableModule, 
    MatSlideToggleModule,
    MatExpansionModule,
    MatCardModule,
    MatTooltipModule,
    BsDatepickerModule.forRoot(),

    // Standalone-components used in none-standalone module.
    DetailsPanelComponent,
    AppMapComponent,
    FindPanelComponent,
    PublicNoticesFilterPanelComponent,
    PublicNoticesPanelComponent,
    ShortenPipe
  ],
  declarations: [
    ProjectsComponent
  ]
})
export class ProjectsModule {}
