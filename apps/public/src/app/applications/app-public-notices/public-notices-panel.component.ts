import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
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
    public urlService: UrlService
  ) {}

  ngOnInit(): void {
    this.pNotices = this.getMockPublicNotices();
  }

  public showDetails() {
    this.update.emit({ search: false, resetMap: false, hidePanel: true });
    setTimeout(() => {
      // this.urlService.setQueryParam('id', this.projectSummary.id.toString());
      this.urlService.setQueryParam('id', '1180'); // TODO: adjust this, hardcoded for now.
      this.urlService.setFragment(Panel.details);
    }, 450);
  }

  ngOnDestroy() {
  }

  private getMockPublicNotices() {
    return [{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'Lumber Co. Ltd.',
      fomNum: 1720,
      fomSummary: 'Sunny Ridge Logging',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: false,
      receiveCommentsAddress: '321 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Saturday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'Lumber Co. Ltd.',
      fomNum: 1720,
      fomSummary: 'Sunny Ridge Logging',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'AKIECA EXPLORERS LTD.',
      fomNum: 1721,
      fomSummary: 'Fusce non tincidunt.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'BELL LUMBER & POLE CANADA, ULC',
      fomNum: 1722,
      fomSummary: 'Donec mattis rhoncus consequat.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'ALBERNI HIGHWAY SAWMILL',
      fomNum: 1723,
      fomSummary: 'Ut pretium congue malesuada.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'Ut et blandit leo, sed efficitur ligula.',
      fomNum: 1724,
      fomSummary: 'Fusce non tincidunt',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'ROYAL PACIFIC TRANSPORT LTD.',
      fomNum: 1725,
      fomSummary: 'Phasellus id porta nulla.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'AKIECA EXPLORERS LTD.',
      fomNum: 1726,
      fomSummary: 'Fusce eget ligula sed metus tincidunt varius.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'BELL LUMBER & POLE CANADA, ULC',
      fomNum: 1727,
      fomSummary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'ALBERNI HIGHWAY SAWMILL',
      fomNum: 1728,
      fomSummary: 'Donec molestie elit ac eleifend dapibus.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'ALBREDA RIVER POLE CO. LTD.',
      fomNum: 1729,
      fomSummary: 'Vestibulum pellentesque justo et sem fringilla, at mattis eros bibendum.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'ROYAL PACIFIC TRANSPORT LTD.',
      fomNum: 1730,
      fomSummary: 'Etiam molestie ligula nunc, vel dignissim diam tincidunt non.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'ALLISON PASS SAWMILLS LTD.',
      fomNum: 1731,
      fomSummary: 'Nullam sagittis elit vel molestie porta. ',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: '"AKIECA EXPLORERS LTD.',
      fomNum: 1732,
      fomSummary: 'Praesent eget molestie est.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'BELL LUMBER & POLE CANADA, ULC',
      fomNum: 1733,
      fomSummary: 'raesent sodales gravida ornare.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'ALBERNI HIGHWAY SAWMILL',
      fomNum: 1734,
      fomSummary: 'Praesent eget molestie est.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'ALBREDA RIVER POLE CO. LTD.',
      fomNum: 1735,
      fomSummary: 'Maecenas eget leo tristique nunc convallis malesuada.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'ROYAL PACIFIC TRANSPORT LTD.',
      fomNum: 1736,
      fomSummary: 'Morbi commodo finibus erat. Phasellus id porta nulla.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'ALLISON PASS SAWMILLS LTD.',
      fomNum: 1737,
      fomSummary: 'Ut pretium congue malesuada. Nulla imperdiet velit nec orci commodo semper.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'AKIECA EXPLORERS LTD.',
      fomNum: 1738,
      fomSummary: 'Nullam egestas sollicitudin ornare.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    },{
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      receiveSameAsReview: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'BELL LUMBER & POLE CANADA, ULC',
      fomNum: 1739,
      fomSummary: 'Pellentesque varius feugiat est at semper.',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    }];
  }

}
