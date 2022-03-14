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
import { PublicNoticeService } from './public-notice.temp.service';

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
    private publicNoticeService: PublicNoticeService
  ) {
    this.user = this.keycloakService.getUser();
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.params.appId;
    // TODO, call swagger api service to get public notice info from backend and set values to form.
    this.publicNoticeResponse = this.publicNoticeService.getMockData(this.projectId);
    let publicNoticeForm = new PublicNoticeForm(this.publicNoticeResponse);
    this.publicNoticeFormGroup = this.formBuilder.formGroup(publicNoticeForm);
    this.onSameAsReviewIndToggled();
  }

  get isLoading() {
    return this.stateSvc.loading;
  }

  onSameAsReviewIndToggled(): void {
    const sameAsReviewIndField = this.publicNoticeFormGroup.get('sameAsReviewInd');
    const receiveCommentsAddressField = this.publicNoticeFormGroup.get('receiveCommentsAddress');
    const receiveCommentsBusinessHoursField = this.publicNoticeFormGroup.get('receiveCommentsBusinessHours');

    if (sameAsReviewIndField.value) {
      receiveCommentsAddressField.disable();
      receiveCommentsAddressField.setValue(null);

      receiveCommentsBusinessHoursField.disable();
      receiveCommentsBusinessHoursField.setValue(null);
    }
    else {
      receiveCommentsAddressField.enable();
      receiveCommentsBusinessHoursField.enable();
    }
  }

  cancelChanges() {
    this.router.navigate(['/a', this.projectId]);
  }

  onSubmit() {
    console.log("submitting publicNotice: ", this.publicNoticeFormGroup.value);
    // TODO: check if form touched and valid before further logic. Below is tempoary logic.
    Object.assign(this.publicNoticeResponse, this.publicNoticeFormGroup.value);
    this.publicNoticeService.setMockData(this.publicNoticeResponse);
    this.router.navigate(['/a', this.projectId]);
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
