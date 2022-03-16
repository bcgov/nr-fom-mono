import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';

import {RxFormBuilder} from '@rxweb/reactive-form-validators';
import {StateService} from '../../../core/services/state.service';
import {User} from "@api-core/security/user";
import {KeycloakService} from "../../../core/services/keycloak.service";
import { FormGroup } from '@angular/forms';
import { PublicNoticeForm } from './public-notice.form';
import { PublicNoticeService } from './public-notice.temp.service';
import { ProjectResponse, WorkflowStateEnum } from '@api-client';
import { ModalService } from '@admin-core/services/modal.service';

@Component({
  selector: 'app-public-notice-edit',
  templateUrl: './public-notice-edit.component.html',
  styleUrls: ['./public-notice-edit.component.scss']
})
export class PublicNoticeEditComponent implements OnInit, AfterViewInit, OnDestroy {
  user: User;
  project: ProjectResponse;
  projectId: number;
  publicNoticeResponse: any;
  publicNoticeFormGroup: FormGroup;
  addressLimit: number = 450;
  editMode: boolean; // 'edit'/'view' mode.

  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: RxFormBuilder,
    public stateSvc: StateService,
    private keycloakService: KeycloakService,
    private modalSvc: ModalService,
    private publicNoticeService: PublicNoticeService
  ) {
    this.user = this.keycloakService.getUser();
  }

  ngOnInit() {
    this.route.data
      .subscribe((data) => {
        this.project = data.projectDetail;
      }
    );

    this.editMode = this.route.snapshot.url.filter(
      (seg)=> seg.path.includes('edit')
    ).length != 0;
  
    this.projectId = this.route.snapshot.params.appId;
    // TODO, call swagger api service to get public notice info from backend and set values to form.
    // TODO, also in this case, handle 'add new public notice' scenario to init empty public notice form.
    this.publicNoticeResponse = this.publicNoticeService.getMockData(this.projectId);
    let publicNoticeForm = new PublicNoticeForm(this.publicNoticeResponse);
    this.publicNoticeFormGroup = this.formBuilder.formGroup(publicNoticeForm);
    this.onSameAsReviewIndToggled();

    if (!this.editMode) {
      this.publicNoticeFormGroup.disable();
    }
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

  canDelete() {
    const workflowStateCode = this.project.workflowState.code;
    if (WorkflowStateEnum.Initial === workflowStateCode) {
      return this.user.isAuthorizedForClientId(this.project.forestClient.id);
    }
    else if (!this.user.isMinistry) {
      return false;
    }
  }

  deletePublicNotice() {
    const dialogRef = this.modalSvc.openConfirmationDialog(
      `You are about to delete Online Public Notice <strong>#${this.publicNoticeResponse.id}</strong>. Are you sure?`,
      'Delete Online Public Notice');

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        // this.isLoading = true; TODO: verify if isLoading/end isLoading from "stateSvc" really works 
        // TODO: delete Public Notice from backend.
        this.publicNoticeService.setMockData({});
        this.router.navigate(['/a', this.projectId]);
      }
    });
  }

  cancelChanges() {
    this.router.navigate(['/a', this.projectId]);
  }

  onSubmit() {
    if (this.editMode) {
      console.log("submitting publicNotice: ", this.publicNoticeFormGroup.value); // TODO: remove this later.
      // TODO: check if form touched and valid before further logic. Below is tempoary logic.
      // TODO: check once again, only allowed to submit when state is 'INITIAL' (or maybe move this check to backend.)
      Object.assign(this.publicNoticeResponse, this.publicNoticeFormGroup.value);
      this.publicNoticeService.setMockData(this.publicNoticeResponse);
    }
    this.router.navigate(['/a', this.projectId]);
  }

  getErrorMessage(controlName: string, messageKey: string = null): string {
    const errors = this.publicNoticeFormGroup.controls[controlName]?.errors;
    if (errors !== null) {
      const { [messageKey]: messages } = errors;
      if (messages) return messages.message;
    }
    return null;
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
