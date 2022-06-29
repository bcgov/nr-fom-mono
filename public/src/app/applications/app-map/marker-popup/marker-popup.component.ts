import { Component, OnInit, OnDestroy } from '@angular/core';
import { UrlService } from '../../../../../src/core/services/url.service';
import { Panel } from '../../../applications/utils/panel.enum';
import { ProjectPublicSummaryResponse } from '../../../../../../libs/client/typescript-ng';
import { StateService } from '../../../../../src/core/services/state.service';
import * as _ from 'lodash';

@Component({
  templateUrl: './marker-popup.component.html',
  styleUrls: ['./marker-popup.component.scss']
})
export class MarkerPopupComponent implements OnInit, OnDestroy {
  public projectSummary: ProjectPublicSummaryResponse;
  public workflowStatus = _.keyBy(this.stateSvc.getCodeTable('workflowStateCode'), 'code');

  constructor(
    private stateSvc: StateService,
    public urlService: UrlService
  ) {}

  public ngOnInit() {
    // Deliberately empty
  }

  public ngOnDestroy() {
    // Deliberately empty
  }

  public showDetails() {
    this.urlService.setQueryParam('id', this.projectSummary.id.toString());
    this.urlService.setFragment(Panel.details);
  }
}
