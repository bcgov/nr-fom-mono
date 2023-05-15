import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InteractionResponse, InteractionService, ProjectResponse, WorkflowStateEnum } from '@api-client';
import { User } from "@utility/security/user";
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CognitoService } from "../../../core/services/cognito.service";
import { ModalService } from '../../../core/services/modal.service';
import { InteractionDetailComponent } from './interaction-detail/interaction-detail.component';
import { InteractionRequest } from './interaction-detail/interaction-detail.form';

export const ERROR_DIALOG = {
  // title: 'The requested project does not exist.',
  // message: 'Please try again.',  
  width: '340px',
  height: '200px',
  buttons: {
    cancel: {
      text: 'Close'
    }
  }
};

@Component({
    standalone: true,
    imports: [
        NgIf, 
        RouterLink, 
        NgFor, 
        InteractionDetailComponent, 
        AsyncPipe, 
        DatePipe
    ],
    selector: 'app-interactions',
    templateUrl: './interactions.component.html',
    styleUrls: ['./interactions.component.scss']
})
export class InteractionsComponent implements OnInit, OnDestroy {

  @ViewChild('interactionDetailForm') 
  interactionDetailForm: InteractionDetailComponent;
  @ViewChild('interactionListScrollContainer', {read: ElementRef})
  public interactionListScrollContainer: ElementRef;
  
  projectId: number;
  project: ProjectResponse;
  selectedItem: InteractionResponse;
  loading = false;
  private user: User;

  data$: Observable<InteractionResponse[]>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private interactionSaved$ = new Subject<void>(); // To notify when 'save' happen.

  constructor(    
    private route: ActivatedRoute,
    private interactionSvc: InteractionService,
    private cognitoService: CognitoService,
    private modalSvc: ModalService) 
  { 
    this.user = this.cognitoService.getUser();
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params.appId;
    this.data$ = this.getProjectInteractions();

    this.interactionSaved$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.data$ = this.getProjectInteractions();
    });

    this.route.data
        .subscribe((data: { project: ProjectResponse}) => {
          this.project = data.project;
        });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getProjectInteractions() {
    return this.interactionSvc.interactionControllerFind(this.projectId);
  }

  onInteractionItemClicked(item: InteractionResponse, pos: number) {
    this.selectedItem = item;
    this.interactionDetailForm.editMode = this.canModifyInteraction(); // set this first.
    this.interactionDetailForm.selectedInteraction = item;
    if (pos) {
      // !! important to wait or will not see the effect.
      setTimeout(() => {
        this.interactionListScrollContainer.nativeElement.scrollTop = pos;
      }, 150);
    }
  }

  // Verify if condition is met to allow user modifying this Interaction.
  canModifyInteraction() {
    return this.user.isAuthorizedForClientId(this.project.forestClient.id) &&
          (
            (this.project.workflowState.code == WorkflowStateEnum.CommentOpen)
            || (this.project.workflowState.code == WorkflowStateEnum.CommentClosed)
          );
  }

  addEmptyInteractionDetail() {
    this.selectedItem = null;
    this.interactionDetailForm.editMode = this.canModifyInteraction(); // set this first.
    this.interactionDetailForm.selectedInteraction = {} as InteractionResponse;
  }

  async saveInteraction(saveReq: InteractionRequest, selectedInteraction: InteractionResponse) {
    const {id} = selectedInteraction;
    const resultPromise = this.prepareSaveRequest(id, this.projectId, saveReq, selectedInteraction);
    resultPromise
      .then((result) => this.handleSaveSuccess(result))
      .catch((err) => this.handleSaveError(err));
  }

  async deleteInteraction(selectedInteraction: InteractionResponse) {
    const dialogRef = this.modalSvc.openConfirmationDialog(`You are about to delete this engagement. Are you sure?`, 'Delete Engagement');
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.loading = true;
        this.interactionSvc.interactionControllerRemove(selectedInteraction.id).subscribe(()=> {
          this.selectedItem = null;
          setTimeout(() => {
          this.loading = false;
            this.interactionSaved$.next();// trigger list retrieving.
          }, 100);

        });
      }
    })
  }

  private prepareSaveRequest(id: number, projectId: number, saveReq: InteractionRequest, selectedInteraction: InteractionResponse)
          : Promise<InteractionResponse> {
    let resultPromise: Promise<InteractionResponse>;
    if (!id) {
      resultPromise = this.interactionSvc.interactionControllerCreate(saveReq.fileContent, projectId,
        saveReq.stakeholder,
        saveReq.communicationDate,
        saveReq.communicationDetails,
        saveReq.filename).toPromise();
    }
    else {
      saveReq.revisionCount = selectedInteraction.revisionCount;
      resultPromise = this.interactionSvc.interactionControllerUpdate(id, saveReq.fileContent,
        this.projectId,
        saveReq.stakeholder,
        saveReq.communicationDate,
        saveReq.communicationDetails,
        saveReq.revisionCount,
        saveReq.filename).toPromise();
    }
    return resultPromise;
  }

  private handleSaveSuccess(result: any) {
    const pos = this.interactionListScrollContainer.nativeElement.scrollTop;
    this.interactionSaved$.next();
    this.selectedItem = result; // updated selected.
    this.loading = false;
    setTimeout(() => {
      this.onInteractionItemClicked(this.selectedItem, pos);
    }, 300);
  }

  private handleSaveError(err: any) {
    // Let HTTP Error Interceptor show the error for now.
    console.error('Failed to save', err);
    this.loading = false;
  }

}