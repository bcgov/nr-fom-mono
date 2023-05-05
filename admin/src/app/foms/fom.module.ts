// modules
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FomRoutingModule} from './fom-routing.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatBadgeModule } from '@angular/material/badge';

// components
import {FomDetailComponent} from './fom-detail/fom-detail.component';
import {FomAddEditComponent} from './fom-add-edit/fom-add-edit.component';
import {ReviewCommentsComponent} from './review-comments/review-comments.component';
import {CommentDetailComponent} from './review-comments/comment-detail/comment-detail.component';
import { FomSubmissionComponent } from './fom-submission/fom-submission.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AttachmentUploadService } from '../../core/utils/attachmentUploadService';
import { ShapeInfoComponent } from './shape-info/shape-info.component';
import { DetailsMapComponent } from './details-map/details-map.component';
import { InteractionsComponent } from './interactions/interactions.component';
import { InteractionDetailComponent } from './interactions/interaction-detail/interaction-detail.component';
import { SummaryComponent } from './summary/summary.component';
import { MatIconModule } from '@angular/material/icon';
import { CommentsSummaryComponent } from './summary/comments-summary/comments-summary.component';
import { InteractionsSummaryComponent } from './summary/interactions-summary/interactions-summary.component';
import {AttachmentResolverSvc} from "../../core/services/AttachmentResolverSvc";
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SubmissionFormatOverviewComponent } from './fom-submission/submission-format-overview.component';
import { EnddateChangeModalComponent } from './fom-detail/enddate-change-modal/enddate-change-modal.component';
import { PublicNoticeEditComponent } from './public-notice/public-notice-edit.component';

@NgModule({
    imports: [
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      SharedModule,
      NgbModule,
      FomRoutingModule,
      BrowserAnimationsModule,
      BsDatepickerModule.forRoot(),
      MatTableModule,
      MatSlideToggleModule,
      MatExpansionModule,
      MatCardModule,
      MatIconModule,
      MatBadgeModule,
      MatSelectModule
  ],
  declarations: [
    FomDetailComponent,
    EnddateChangeModalComponent,
    DetailsMapComponent,
    FomAddEditComponent,
    ReviewCommentsComponent,
    CommentDetailComponent,
    FomSubmissionComponent,
    SubmissionFormatOverviewComponent,
    ShapeInfoComponent,
    InteractionsComponent,
    InteractionDetailComponent,
    SummaryComponent,
    CommentsSummaryComponent,
    InteractionsSummaryComponent,
    PublicNoticeEditComponent
  ],
  exports: [
    FomDetailComponent,
    DetailsMapComponent,
    FomAddEditComponent,
    ReviewCommentsComponent,
    CommentDetailComponent,
    FomSubmissionComponent,
    ShapeInfoComponent
  ],
  providers: [
    AttachmentUploadService,
    AttachmentResolverSvc
  ]
})
export class FomModule {
}
