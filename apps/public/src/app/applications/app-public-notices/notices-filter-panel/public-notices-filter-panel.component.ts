import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFilterFields } from '../../utils/filter';
import moment = require('moment');

@Component({
  selector: 'notices-filter-panel',
  templateUrl: './public-notices-filter-panel.component.html',
  styleUrls: ['./public-notices-filter-panel.component.scss']
})
export class PublicNoticesFilterPanelComponent implements OnInit {

  filter: NoticeFilter;
  maxDate: Date = new Date();

  @Input() 
  districtList: string[];
  
  @Output() 
  filterPublicNoticesEvt = new EventEmitter<NoticeFilter>();

  ngOnInit(): void {
    this.filter = new NoticeFilter();
  }

  onFilterChange(): void {
    this.filterPublicNoticesEvt.emit(this.filter);
  }

}
export class NoticeFilter {
  forestClientName: IFilterFields<string> = { queryParam: 'forestClientName', value: null};
  districtName: IFilterFields<string> = { queryParam: 'districtName', value: null};
  commentingOpenDate: IFilterFields<Date> = { queryParam: 'commentingOpenDate', value: null};
}

