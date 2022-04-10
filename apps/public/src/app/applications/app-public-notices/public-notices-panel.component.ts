import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { PublicNoticePublicFrontEndResponse, PublicNoticeService } from '@api-client';
import { UrlService } from '@public-core/services/url.service';
import { IUpdateEvent } from '../projects.component';
import { Panel } from '../utils/panel.enum';
import { NoticeFilter } from './notices-filter-panel/public-notices-filter-panel.component';
import moment = require('moment');

@Component({
  selector: 'app-public-notices-panel',
  templateUrl: './public-notices-panel.component.html',
  styleUrls: ['./public-notices-panel.component.scss']
})
export class PublicNoticesPanelComponent implements OnDestroy, OnInit {
  @Output() update = new EventEmitter<IUpdateEvent>();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  isLoading = false;
  pNotices: Array<PublicNoticePublicFrontEndResponse>;
  districtList: string[]

  constructor(
    public urlService: UrlService,
    public publicNoticeService: PublicNoticeService
  ) {}

  ngOnInit(): void {
    this.publicNoticeService
      .publicNoticeControllerFindListForPublicFrontEnd()
      .subscribe((results) => {
        this.pNotices = results;
        if (this.pNotices) {
          this.districtList = [...new Set(
              this.pNotices
                .filter(pn => pn.project.district != undefined)
                .map(pn => pn.project.district?.name)
            )].sort();
        }
      });
  }

  public showDetails(id: number) {
    this.update.emit({ search: false, resetMap: false, hidePanel: true });
    setTimeout(() => {
      this.urlService.setQueryParam('id', id.toString());
      this.urlService.setFragment(Panel.details);
    }, 450);
  }

  public handlePublicNoticesFilterUpdate(updateEvent: NoticeFilter) {
    // TODO...
  }

  ngOnDestroy() {
  }

}
