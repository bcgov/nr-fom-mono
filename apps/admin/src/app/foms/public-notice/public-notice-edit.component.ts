import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {lastValueFrom, map, of, Subject, switchMap} from 'rxjs';

import {RxFormBuilder} from '@rxweb/reactive-form-validators';
import {StateService} from '../../../core/services/state.service';
import {User} from "@api-core/security/user";
import {KeycloakService} from "../../../core/services/keycloak.service";
import { FormGroup } from '@angular/forms';
import { PublicNoticeForm } from './public-notice.form';
import { 
  ProjectResponse, PublicNoticeCreateRequest, PublicNoticeResponse, 
  PublicNoticeService, PublicNoticeUpdateRequest, WorkflowStateEnum 
} from '@api-client';
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
  publicNoticeResponse: PublicNoticeResponse;
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
    this.projectId = this.route.snapshot.params.appId;
    this.editMode = this.route.snapshot.url.filter(
      (seg)=> seg.path.includes('edit')
    ).length != 0;

    this.route.data
      .pipe(
        switchMap((resolverData) => {
          const publicNoticeId = resolverData['projectDetail'].publicNoticeId;
          if (!publicNoticeId) {
            return of({data: resolverData, publicNotice: null});
          }
          return this.publicNoticeService.publicNoticeControllerFindOne(publicNoticeId)
            .pipe(
              map(pn => {
                return {data: resolverData, publicNotice: pn}
              })
            );
        })
      )
      .subscribe((result) => {
        this.project = result.data.projectDetail;
        this.publicNoticeResponse = result.publicNotice;
        let publicNoticeForm = new PublicNoticeForm(this.publicNoticeResponse);
        this.publicNoticeFormGroup = this.formBuilder.formGroup(publicNoticeForm);

        if (!this.editMode) {
          this.publicNoticeFormGroup.disable();
        }
        this.onSameAsReviewIndToggled();
      }
    );
  }

  get isLoading() {
    return this.stateSvc.loading;
  }

  isAddNewNotice() {
    return this.editMode && !this.publicNoticeResponse;
  }

  onSameAsReviewIndToggled(): void {
    const sameAsReviewIndField = this.publicNoticeFormGroup.get('isReceiveCommentsSameAsReview');
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
    if (this.editMode && !this.publicNoticeResponse) {
      // Case of new Public Notice
      return false;
    }
    const workflowStateCode = this.project?.workflowState.code;
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
        // this.publicNoticeTempService.setMockData({});
        this.router.navigate(['/a', this.projectId]);
      }
    });
  }

  cancelChanges() {
    this.router.navigate(['/a', this.projectId]);
  }

  async onSubmit() {
    if (this.editMode && this.publicNoticeFormGroup.touched 
        && this.publicNoticeFormGroup.valid) {
      // TODO: check once again, only allowed to submit when state is 'INITIAL' (move this check to backend.)
      if (this.publicNoticeResponse) {
        await lastValueFrom(this.updatePublicNotice());
      }
      else {
        // POST - Create Public Notice.
        await lastValueFrom(this.createNewPublicNotice());
      }
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

  private createNewPublicNotice() {
    let createBody = this.publicNoticeFormGroup.value as PublicNoticeCreateRequest
    createBody.projectId = this.project.id;
    return this.publicNoticeService.publicNoticeControllerCreate(createBody);
  }

  private updatePublicNotice() {
    const updateBody = this.publicNoticeFormGroup.value as PublicNoticeUpdateRequest;
    updateBody.projectId = this.project.id;
    updateBody.revisionCount = this.publicNoticeResponse.revisionCount;
    return this.publicNoticeService.publicNoticeControllerUpdate(this.publicNoticeResponse.id, updateBody);
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
