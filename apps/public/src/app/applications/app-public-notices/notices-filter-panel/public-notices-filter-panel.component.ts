import { Component, OnDestroy, OnInit } from '@angular/core';
import moment = require('moment');
import { IFilterFields } from '../../utils/filter';

@Component({
  selector: 'notices-filter-panel',
  templateUrl: './public-notices-filter-panel.component.html',
  styleUrls: ['./public-notices-filter-panel.component.scss']
})
export class PublicNoticesFilterPanelComponent implements OnDestroy, OnInit {

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }
}

