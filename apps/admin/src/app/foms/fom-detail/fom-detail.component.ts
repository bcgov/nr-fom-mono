import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import { AttachmentResponse, WorkflowStateEnum, ProjectWorkflowStateChangeRequest, SubmissionService, ProjectResponse, ProjectService, SpatialFeaturePublicResponse } from "@api-client";
import { KeycloakService } from '@admin-core/services/keycloak.service';
import {User} from "@api-core/security/user";
import { ModalService } from '@admin-core/services/modal.service';
import * as moment from 'moment';
import {AttachmentResolverSvc} from "@admin-core/services/AttachmentResolverSvc";


@Component({
  selector: 'app-application-detail',
  templateUrl: './fom-detail.component.html',
  styleUrls: ['./fom-detail.component.scss']
})
export class FomDetailComponent implements OnInit, OnDestroy {
  public isPublishing = false;
  public isDeleting = false;
  public isFinalizing = false;
  public isRefreshing = false;
  public application: ProjectResponse = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  public project: ProjectResponse = null;
  public spatialDetail: SpatialFeaturePublicResponse[];
  public isProjectActive = false;
  public attachments: AttachmentResponse[] = [];
  public user: User;
  public daysRemaining: number = null;
  private workflowStateChangeRequest: ProjectWorkflowStateChangeRequest = <ProjectWorkflowStateChangeRequest>{};
  private now = new Date();
  private today = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalSvc: ModalService,
    public projectService: ProjectService, // also used in template
    private submissionSvc: SubmissionService,
    private keycloakService: KeycloakService,
    public attachmentResolverSvc: AttachmentResolverSvc
  ) {
    this.user = this.keycloakService.getUser();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    // get data from route resolver
    this.route.data
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: { application: ProjectResponse, spatialDetail: Array<SpatialFeaturePublicResponse> }) => {
      if (data.application) {
        this.project = data.application;
        if (this.project.workflowState['code'] === 'INITIAL') {
          this.isProjectActive = true;
        }
      } else {
        alert("Uh-oh, couldn't load fom");
        // application not found --> navigate back to search
        this.router.navigate(['/search']);
      }

      this.spatialDetail = data.spatialDetail;
      this.calculateDaysRemaining();
      this.attachmentResolverSvc.getAttachments(this.project.id)
        .then( (result) => {
          this.attachments = result;
          //Sorting by Public Notice and Supporting Document
          this.attachments.sort((a,b) => (a.attachmentType.code < b.attachmentType.code? -1 : 1));
        }).catch((error) => {
        console.error(error);
      });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public deleteAttachment(id: number) {
    const dialogRef = this.modalSvc.openConfirmationDialog(`You are about to delete this attachment. Are you sure?`, 'Delete Attachment');
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        let result = this.attachmentResolverSvc.attachmentControllerRemove(id);
        result.then( () => {
          return this.onSuccess();
        }).catch( (error) => {
          console.error(error);
        })
      }
    })
  }

  onSuccess() {
    this.router.navigate([`a/${this.project.id}`])
      .then( () => {
        window.location.reload();
      })
  }

  deleteFOM() {
    const dialogRef = this.modalSvc.openConfirmationDialog(`You are about to withdraw FOM ${this.project.id} - ${this.project.name}. Are you sure?`, 'Withdraw FOM');
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.isDeleting = true;
        this.projectService.projectControllerRemove(this.project.id)
        .subscribe(
          ()=> {
            this.isDeleting = false;
            this.router.navigate(['/search']); // Delete successfully, back to search.
          },
          (error) => {
            this.isDeleting = false;
            console.error(error);
          }
        );
      }
    })
  }

  finalizeFOM() {
    const dialogRef = this.modalSvc.openConfirmationDialog(`You are about to finalize FOM ${this.project.id} - ${this.project.name}. Are you sure?`, 'Finalize FOM');
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.isFinalizing = true;
        this.projectService.projectControllerStateChange(
            this.project.id,
            {
              workflowStateCode: WorkflowStateEnum.Finalized,
              revisionCount: this.project.revisionCount
            }
        )
        .subscribe(
          (result)=> {
            this.isFinalizing = false;
            this.onSuccess();
          },
          (error) => {
            this.isFinalizing = false;
            console.error(error);
          }
        );
      }
    })
  }

  private calculateDaysRemaining(){
    this.daysRemaining =
      moment(this.project.commentingClosedDate).diff(moment(this.today), 'days');
    if(this.daysRemaining < 0){
      this.daysRemaining = 0;
    }
  }

  public async publishFOM(){
    const ready = this.validatePublishReady();
    if (ready) {
      this.workflowStateChangeRequest.workflowStateCode = WorkflowStateEnum.Published;
      this.workflowStateChangeRequest.revisionCount = this.project.revisionCount;

      this.isPublishing = true;
      const result = await this.projectService.projectControllerStateChange(this.project.id, this.workflowStateChangeRequest).pipe(tap(obs => console.log(obs))).toPromise()
      this.isPublishing = false;
      const {id} = result;
      if (!id) {
      }
      this.onSuccess()
    }
  }

  private validatePublishReady() {
    let ready = true;
    if (moment(this.project.commentingClosedDate).diff(moment(this.project.commentingOpenDate), 'days') < 30) {
      ready = false;
      this.modalSvc.openWarningDialog('Comment End Date must be at least 30 days after Comment Start Date when "Publish" is pushed.');
    }

    if (!this.spatialDetail || this.spatialDetail.length == 0) {
      ready = false;
      this.modalSvc.openWarningDialog('Proposed FOM spatial file should be uploaded before "Publish" is pushed.');
    }

    if(moment(this.project.commentingOpenDate).diff(moment(this.today), 'days') < 1){
      ready = false;
      this.modalSvc.openWarningDialog('Comment Start Date must be at least one day after "Publish" is pushed.');
    }
    return ready;
  }

  /**
    INITIAL: holder can withdraw.
    PUBLISH/COMMENT_OPEN: no actions.
    COMMENT_CLOSED/FINALIZED/EXPIRED: gov
  */
  public canWithdraw() {
    const workflowStateCode = this.project.workflowState.code;
    if (WorkflowStateEnum.Initial === workflowStateCode) {
      return this.user.isAuthorizedForClientId(this.project.forestClient.id);
    }
    else if (!this.user.isMinistry) {
      return false;
    }

    return [WorkflowStateEnum.CommentClosed, WorkflowStateEnum.Finalized, WorkflowStateEnum.Expired]
            .includes(workflowStateCode as WorkflowStateEnum);
  }

  public canFinalize() {
    return this.user.isAuthorizedForClientId(this.project.forestClient.id)
    && this.project.workflowState.code === WorkflowStateEnum.CommentClosed;
  }

  public canAccessComments(): boolean {
    const userCanView = this.user.isMinistry || this.user.isAuthorizedForClientId(this.project.forestClient.id);
    return userCanView && (this.project.workflowState.code !== WorkflowStateEnum.Initial
                        && this.project.workflowState.code !== WorkflowStateEnum.Published);
  }

  public canEditFOM(): boolean {
    const userCanEdit = this.user.isAuthorizedForClientId(this.project.forestClient.id);
    return userCanEdit && (this.project.workflowState.code !== WorkflowStateEnum.Finalized
      && this.project.workflowState.code !== WorkflowStateEnum.Expired);
  }

  public canViewSubmission(): boolean {
    const userCanView = this.user.isAuthorizedForClientId(this.project.forestClient.id);
    return userCanView && (this.project.workflowState.code === WorkflowStateEnum.Initial
      || this.project.workflowState.code === WorkflowStateEnum.CommentClosed);
  }

  public canViewPublishing(): boolean {
    return this.user.isAuthorizedForClientId(this.project.forestClient.id)
      && this.project.workflowState.code === WorkflowStateEnum.Initial;
  }

  public canAccessInteractions(): boolean {
    return this.canAccessComments(); // same as comments for access/viewing.
  }

  /*
  * Only allows Supporting_Doc to be deleted in the defined states
  */
  public isDeleteAttachmentAllowed(attachment: AttachmentResponse) {
    return this.attachmentResolverSvc.isDeleteAttachmentAllowed(this.project.workflowState.code, attachment);
  }

}
