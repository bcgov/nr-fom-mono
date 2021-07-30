import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of, Subject} from 'rxjs';
import {switchMap, takeUntil, tap} from 'rxjs/operators';

import {
  ProjectResponse,
  ProjectService,
  SpatialObjectCodeEnum,
  SubmissionRequest,
  SubmissionTypeCodeEnum
} from '@api-client';
import {RxFormBuilder, RxFormGroup} from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import {FomSubmissionForm} from './fom-submission.form';
import {StateService} from '../../../core/services/state.service';
import {ModalService} from '../../../core/services/modal.service';
import {SubmissionService, WorkflowStateEnum} from '@api-client';

@Component({
  selector: 'app-fom-submission',
  templateUrl: './fom-submission.component.html',
  styleUrls: ['./fom-submission.component.scss'],
  providers: [DatePipe]
})
export class FomSubmissionComponent implements OnInit, AfterViewInit, OnDestroy {
  fg: RxFormGroup;
  project: ProjectResponse;

  public originalSubmissionRequest:  SubmissionRequest;
  public applicationFiles: File[] = [];
  public fileTypesParent: string[] = ['text/plain', 'application/json']
  private scrollToFragment: string = null;
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  files: any[] = [];
  public geoTypeValues: String[] = [];
  contentFile: string;

  get isLoading() {
    return this.stateSvc.loading;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private projectSvc: ProjectService,
    private formBuilder: RxFormBuilder,
    private stateSvc: StateService,
    private modalSvc: ModalService,
    private submissionSvc: SubmissionService,
  ) {  }

  // check for unsaved changes before navigating away from current route (ie, this page)
  public canDeactivate(): Observable<boolean> | boolean {
    if (!this.fg) {
      return true;
    }

    // allow synchronous navigation if everything is OK
    if (!this.fg.dirty && !this.fg.isModified) {
      return true;
    }

    return false;
  }

  public cancelChanges() {
    // this.location.back(); // FAILS WHEN CANCEL IS CANCELLED (DUE TO DIRTY FORM OR UNSAVED DOCUMENTS) MULTIPLE TIMES
    const routerFragment = ['/a', this.project.id]
    this.router.navigate(routerFragment);

  }

  ngOnInit() {
   this.geoTypeValues = Object.values(SpatialObjectCodeEnum);
    this.route.url.pipe(takeUntil(this.ngUnsubscribe), switchMap(url => {
        return this.projectSvc.projectControllerFindOne(this.route.snapshot.params.appId);
      }
    )).subscribe((data: ProjectResponse) => {
      this.project = data as ProjectResponse;
      this.originalSubmissionRequest = <SubmissionRequest> {
        projectId: data.id,
        submissionTypeCode: data.workflowState.code === WorkflowStateEnum.CommentClosed ? SubmissionTypeCodeEnum.Final: SubmissionTypeCodeEnum.Proposed,
        spatialObjectCode: SpatialObjectCodeEnum.CutBlock,
        jsonSpatialSubmission: Object
      }
      // this.isSubmissionAllowed();
      const form = new FomSubmissionForm(this.originalSubmissionRequest);
      this.fg = <RxFormGroup>this.formBuilder.formGroup(form);
      this.fg.get('projectId').setValue(this.originalSubmissionRequest.projectId);
      this.fg.get('submissionTypeCode').setValue(this.originalSubmissionRequest.submissionTypeCode);

    });
  }

  ngAfterViewInit() {
    // if requested, scroll to specified section
    if (this.scrollToFragment) {
      // ensure element exists
      const element = document.getElementById(this.scrollToFragment);
      if (element) {
        element.scrollIntoView();
      }
    }
  }

  ngOnDestroy() {
    // dismiss any open snackbar
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  addNewFiles(newFiles: any[]) {
    this.files.push(newFiles);
  }

  getContentFileFromUpload(fileContent: string) {
    this.contentFile = fileContent;
    try {
      this.originalSubmissionRequest.jsonSpatialSubmission = JSON.parse(this.contentFile);
    }catch (e) {
      this.modalSvc.openErrorDialog('The file is not in a valid JSON format. Please fix your file and try again.');
    }
    this.fg.get('jsonSpatialSubmission').setValue(this.originalSubmissionRequest.jsonSpatialSubmission);
  }

  validate() {
    if (!this.fg.valid) {
      this.fg.markAllAsTouched();
      this.fg.updateValueAndValidity({onlySelf: false, emitEvent: true});
      // TODO: This needs better text description.
      this.modalSvc.openWarningDialog('Invalid inputs');
    }
    return this.fg.valid;
  }

  async submit() {
    // TODO: We need go improve this as it's returning null (this comment left over from development, might not be valid?)
    const {projectId, submissionTypeCode, ...rest} = this.originalSubmissionRequest;
    let submissionRequest = {...rest, ...this.fg.value}
    await this.submissionSvc.submissionControllerProcessSpatialSubmission(submissionRequest as SubmissionRequest).toPromise();
    this.onSuccess(this.originalSubmissionRequest.projectId);
  }

  onSuccess(id: number) {
    this.router.navigate([`a/${id}`])

  }

  changeGeoType(e) {
    this.fg.get('spatialObjectCode').setValue(e.target.value);
  }

  getGeoSpatialTypeDescription(type: String){
    if( type === SpatialObjectCodeEnum.CutBlock ){
      return 'Cut block'
    }else if( type === SpatialObjectCodeEnum.RoadSection ) {
      return 'Road section'
    }
    return 'Wildlife/tree retention area'
  }

  public isSubmissionAllowed(){
    return this.project.workflowState.code === WorkflowStateEnum.Initial
      || this.project.workflowState.code === WorkflowStateEnum.CommentClosed ;
  }
}
