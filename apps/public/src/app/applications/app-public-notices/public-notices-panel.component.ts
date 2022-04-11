import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { PublicNoticePublicFrontEndResponse, PublicNoticeService } from '@api-client';
import { UrlService } from '@public-core/services/url.service';
import * as _ from 'lodash';
import { IUpdateEvent } from '../projects.component';
import { Panel } from '../utils/panel.enum';
import { NoticeFilter } from './notices-filter-panel/public-notices-filter-panel.component';
import moment = require('moment');
@Component({
  selector: 'app-public-notices-panel',
  templateUrl: './public-notices-panel.component.html',
  styleUrls: ['./public-notices-panel.component.scss']
})
export class PublicNoticesPanelComponent implements OnInit {
  @Output() update = new EventEmitter<IUpdateEvent>();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  isLoading = false;
  pNotices: Array<PublicNoticePublicFrontEndResponse>;
  initialPNotices: Array<PublicNoticePublicFrontEndResponse>;
  districtList: string[]

  constructor(
    public urlService: UrlService,
    public publicNoticeService: PublicNoticeService
  ) {}

  ngOnInit(): void {
    this.publicNoticeService
      .publicNoticeControllerFindListForPublicFrontEnd()
      .subscribe((results) => {
        this.initialPNotices = results;
        if (this.initialPNotices) {
          this.pNotices = [...this.initialPNotices];
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
    const filterConditions = [
      this.condition('project.forestClient.name', 
        updateEvent.forestClientName?.value?.trim(), this.compareFn().in),

      this.condition('project.commentingOpenDate', 
        updateEvent.commentingOpenDate.value, this.compareFn().isDateOnOrAfter),
        
      this.condition('project.district.name', 
        updateEvent.districtName?.value?.trim(), this.compareFn().equal)
    ]

    const filteredResult = [...this.initialPNotices].filter( pn => {
      const resolved = filterConditions.map(cn => cn(pn));
      return resolved.every(x => x === true);
    });

    this.pNotices = [...filteredResult];
  }

  private compareFn() {
    // If 'value'(filter value) is null or underfined, consider this as to include all.
    return {
      equal: function(a: any, value: any) {
        return _.isNil(value) || _.isEqual(a, value);
      },
      in: function(a: any, value: any) {
        return _.isNil(value) || _.includes(a, value);
      },
      isDateOnOrAfter: function(date1: Date, value: Date) {
        return _.isNil(value) || 
              moment(date1).startOf('day').isSameOrAfter(moment(value).startOf('day'));
      }
    }
  }

  private condition(
    key: string, // can be a dot notation path string.
    filterValue: string | Date, 
    comparFn = this.compareFn().equal) {

    if (typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();
    }

    return function(data: PublicNoticePublicFrontEndResponse) {
      let dataValue = _.get(data, key, null);
      if (typeof dataValue === 'string') {
        dataValue = dataValue.toLowerCase();
      }
      return comparFn(dataValue, filterValue);
    }
  }

}
