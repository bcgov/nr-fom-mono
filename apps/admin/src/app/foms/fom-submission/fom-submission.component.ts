import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import { ProjectResponse, ProjectService, SpatialObjectCodeEnum, SubmissionRequest, SubmissionTypeCodeEnum, SubmissionService, WorkflowStateEnum } from '@api-client';
import {RxFormBuilder, RxFormGroup} from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';
import {FomSubmissionForm} from './fom-submission.form';
import {StateService} from '../../../core/services/state.service';
import {ModalService} from '../../../core/services/modal.service';


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
    // can't call location back() - fails when cancel is cancelled due to dirty form or unsaved documents multiple times
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

  submit() {
    const {projectId, submissionTypeCode, ...rest} = this.originalSubmissionRequest;
    let submissionRequest = {...rest, ...this.fg.value}
    this.submissionSvc.submissionControllerProcessSpatialSubmission(submissionRequest as SubmissionRequest)
        .toPromise()
        .then(() => this.onSuccess(this.originalSubmissionRequest.projectId))
        .catch((err) => console.error(err));
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
