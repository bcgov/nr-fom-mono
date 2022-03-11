import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FomDetailComponent} from './fom-detail/fom-detail.component';
import {FomAddEditComponent} from './fom-add-edit/fom-add-edit.component';
import {ProjectDetailResolver, ProjectMetricsDetailResolver, ProjectSpatialDetailResolver} from './fom-resolver.service';
import {ReviewCommentsComponent} from './review-comments/review-comments.component';
import {FomSubmissionComponent} from "./fom-submission/fom-submission.component";
import { InteractionsComponent } from './interactions/interactions.component';
import { SummaryComponent } from './summary/summary.component';
import { PublicNoticeEditComponent } from './public-notice/public-notice-edit.component';

const routes: Routes = [
  {
    path: 'a/create',
    component: FomAddEditComponent
  },
  {
    path: 'a/:appId',
    component: FomDetailComponent,
    resolve: {
      projectDetail: ProjectDetailResolver,
      spatialDetail: ProjectSpatialDetailResolver,
      projectMetrics: ProjectMetricsDetailResolver
    }
  },
  {
    path: 'a/:appId/edit',
    component: FomAddEditComponent
  },
  {
    path: 'comments/:appId',
    component: ReviewCommentsComponent
  },
  {
    path: 'interactions/:appId',
    component: InteractionsComponent,
    resolve: {
      project: ProjectDetailResolver
    }
  },
  {
    path: 'a/:appId/upload',
    component: FomSubmissionComponent
  },
  {
    path: 'a/:appId/summary',
    component: SummaryComponent
  },
  {
    path: 'publicNotice/:appId/edit',
    component: PublicNoticeEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ProjectDetailResolver, ProjectSpatialDetailResolver, ProjectMetricsDetailResolver]
})
export class FomRoutingModule {
}
