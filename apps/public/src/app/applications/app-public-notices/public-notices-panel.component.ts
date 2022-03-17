import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import { PublicNoticeService } from '@api-client';
import { UrlService } from '@public-core/services/url.service';
import * as _ from 'lodash';
import moment = require('moment');
import { IUpdateEvent } from '../projects.component';
import { Panel } from '../utils/panel.enum';

@Component({
  selector: 'app-public-notices-panel',
  templateUrl: './public-notices-panel.component.html',
  styleUrls: ['./public-notices-panel.component.scss']
})
export class PublicNoticesPanelComponent implements OnDestroy, OnInit {
  @Output() update = new EventEmitter<IUpdateEvent>();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  isLoading = false;
  pNotices: any[];

  constructor(
    public urlService: UrlService,
    public publicNoticeService: PublicNoticeService
  ) {}

  ngOnInit(): void {
    this.publicNoticeService
      .publicNoticeControllerFindListForPublicFrontEnd()
      .subscribe((results) => {
        this.pNotices = results
      });
      // .subscribe(results => this.pNotices = this.getMockPublicNotices()); TODO: remove this hardcode mock data later.
  }

  public showDetails(id: number) {
    this.update.emit({ search: false, resetMap: false, hidePanel: true });
    setTimeout(() => {
      this.urlService.setQueryParam('id', id.toString());
      this.urlService.setFragment(Panel.details);
    }, 450);
  }

  ngOnDestroy() {
  }

  private getMockPublicNotices() {
    return [
      {
        "projectId": 3,
        "reviewAddress": "Suite #123, 456 Some Very Long Name Street, Vancouver BC",
        "reviewBusinessHours": "Monday to Friday 8am to 5pm, Weekends 10am - 3pm",
        "receiveCommentsAddress": null,
        "receiveCommentsBusinessHours": null,
        "isReceiveCommentsSameAsReview": true,
        "mailingAddress": "P.O. Box 12345678 Surrey BC",
        "email": "info@industrydomain.com",
        "project": {
          "commentingClosedDate": "2022-04-01",
          "commentingOpenDate": "2021-04-01",
          "validityEndDate": "2024-04-01",
          "createTimestamp": "2021-09-08T19:56:07.713Z",
          "description": "Commenting open with submission project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ",
          "district": {
            "id": 43,
            "name": "Campbell River"
          },
          "forestClient": {
            "id": "00001012",
            "name": "BELL LUMBER & POLE CANADA, ULC"
          },
          "fspId": 10,
          "id": 3,
          "name": "Fake name 3 with lots of comments",
          "revisionCount": 19,
          "commentClassificationMandatory": false
        }
      },
       {
        "projectId": 2440,
        "reviewAddress": "Suite #123, 456 Some Very Long Name Street, Vancouver BC",
        "reviewBusinessHours": "Monday to Friday 8am to 5pm, Weekends 10am - 3pm",
        "receiveCommentsAddress": "101-11234 West 12th Avenue, Vancouver BC V6H 1L9",
        "receiveCommentsBusinessHours": "Monday to Friday 8am to 5pm, Saturday 10am - 2pm",
        "isReceiveCommentsSameAsReview": false,
        "mailingAddress": "P.O. Box 12345678 Surrey BC",
        "email": "info@industrydomain.com",
        "project": {
          "commentingClosedDate": "2022-04-01",
          "commentingOpenDate": "2021-04-01",
          "validityEndDate": "2024-04-01",
          "createTimestamp": "2021-09-08T19:56:07.713Z",
          "description": "Commenting open with submission project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ",
          "district": {
            "id": 43,
            "name": "Campbell River"
          },
          "forestClient": {
            "id": "00001012",
            "name": "BELL LUMBER & POLE CANADA, ULC"
          },
          "fspId": 10,
          "id": 3,
          "name": "Fake name 3 with lots of comments",
          "revisionCount": 19,
          "commentClassificationMandatory": false
        }
      }
    ];
  }

}
