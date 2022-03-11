import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import * as moment from 'moment';

import {RxFormBuilder} from '@rxweb/reactive-form-validators';
import {StateService} from '../../../core/services/state.service';
import {User} from "@api-core/security/user";
import {KeycloakService} from "../../../core/services/keycloak.service";
import { FormGroup } from '@angular/forms';
import { PublicNoticeForm } from './public-notice.form';

@Component({
  selector: 'app-public-notice-edit',
  templateUrl: './public-notice-edit.component.html',
  styleUrls: ['./public-notice-edit.component.scss']
})
export class PublicNoticeEditComponent implements OnInit, AfterViewInit, OnDestroy {
  user: User;
  projectId: number;
  publicNoticeResponse: any;
  publicNoticeFormGroup: FormGroup;
  addressLimit: number = 450;

  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: RxFormBuilder,
    public stateSvc: StateService,
    private keycloakService: KeycloakService,
  ) {
    this.user = this.keycloakService.getUser();
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.params.appId;
    // TODO, call swagger api service to get public notice info from backend and set values to form.
    this.publicNoticeResponse = this.getMockPublicNotice(this.projectId);

    let publicNoticeForm = new PublicNoticeForm(this.publicNoticeResponse);
    this.publicNoticeFormGroup = this.formBuilder.formGroup(publicNoticeForm);
  }

  get isLoading() {
    return this.stateSvc.loading;
  }

  ngAfterViewInit() {
  }

  public cancelChanges() {
    this.router.navigate(['/a', this.projectId]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  private getMockPublicNotice(projectId: number) {
    return {
      reviewFOMAddress: '123 First Street, Vancouver BC',
      reviewFOMBusinessHours: 'Monday to Friday 8am-4pm, Saturday 10am - 2pm',
      sameAsReviewInd: true,
      receiveCommentsAddress: '123 First Street, Vancouver BC',
      receiveCommentsBusinessHours: 'Monday to Friday 10am to 4pm',
      mailingAddress: 'Box 123 Surrey BC',
      email: 'name@industry.com',
      publicNoticeURL: 'https://fom-test.nrs.gov.bc.ca/public/projects?id=1720#details',
      validityPeriod: 'January 1, 2022 to January 1, 2025',
      commentingPeriod: 'January 1, 2022 to January 31, 2022',
	    commentingOpen: 'January 1, 2022',
      fomHolder: 'Lumber Co. Ltd.',
      projectId: projectId,
      fomSummary: 'Sunny Ridge Logging',
      fomDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non tincidunt metus, nec facilisis lectus. Donec auctor vitae mi at ultricies.',
      fspID: 10,
      district: 'Campbell River'
    };
  }
}
