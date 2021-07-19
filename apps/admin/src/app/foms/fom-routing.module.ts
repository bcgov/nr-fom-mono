import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {FomDetailComponent} from './fom-detail/fom-detail.component';
import {FomAddEditComponent} from './fom-add-edit/fom-add-edit.component';
import {ApplicationDetailResolver, ProjectSpatialDetailResolver} from './fom-resolver.service';
import {ReviewCommentsComponent} from './review-comments/review-comments.component';
import {FomSubmissionComponent} from "./fom-submission/fom-submission.component";
import { InteractionsComponent } from './interactions/interactions.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  {
    path: 'a/create',
    component: FomAddEditComponent
  },
  {
    path: 'a/:appId',
    component: FomDetailComponent,
    resolve: {
      application: ApplicationDetailResolver,
      spatialDetail: ProjectSpatialDetailResolver
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
      project: ApplicationDetailResolver
    }
  },
  {
    path: 'a/:appId/upload',
    component: FomSubmissionComponent
  },
  {
    path: 'a/:appId/summary',
    component: SummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ApplicationDetailResolver, ProjectSpatialDetailResolver]
})
export class FomRoutingModule {
}
