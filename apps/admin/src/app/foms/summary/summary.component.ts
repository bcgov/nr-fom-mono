import { CommentScope } from '@admin-core/utils/constants/comment';
import { CommentScopeOpt, COMMENT_SCOPE_CODE } from '@admin-core/utils/constants/constantUtils';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttachmentResponse, AttachmentService, InteractionResponse, InteractionService, 
        ProjectResponse, ProjectService, PublicCommentAdminResponse, PublicCommentService, 
        SpatialFeaturePublicResponse, SpatialFeatureService } from '@api-client';
import { ConfigService } from '@utility/services/config.service';
import * as _ from 'lodash';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

  projectId: number;
  project: ProjectResponse;
  projectReqError: boolean;
  publicComments: PublicCommentAdminResponse[];
  filteredPublicComments: PublicCommentAdminResponse[];
  publicCommentsReqError: boolean;
  spatialDetail: SpatialFeaturePublicResponse[];
  filteredSpatialDetail: SpatialFeaturePublicResponse[];
  spatialDetailReqError: boolean;
  interactions: InteractionResponse[]
  interactionsReqError: boolean;
  attachments: AttachmentResponse[];
  attachmentsReqError: boolean;
  commentScopeOpts :Array<CommentScopeOpt> = [];
  selectedScope: CommentScopeOpt;

  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();
  private scopeOptionChange$ = new Subject<CommentScopeOpt>(); // To notify when scope 'option' changed.

  constructor(    
    private route: ActivatedRoute,
    private projectSvc: ProjectService,
    private commentSvc: PublicCommentService,
    private spatialFeatureSvc: SpatialFeatureService,
    private interactionSvc: InteractionService,
    private attachmentSvc: AttachmentService,
    private configSvc: ConfigService
  ) { }

  async ngOnInit(): Promise<void> {
    this.projectId = this.route.snapshot.params.appId;
    this.getProject(this.projectId); 
    this.getpublicComments(this.projectId);
    this.getSpatialDetails(this.projectId);
    this.getProjectInteractions(this.projectId);
    this.getProjectAttachments(this.projectId);

    this.scopeOptionChange$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((nextScope) => {
      this.doFiltering(nextScope);
    });
  }

  getAttachmentUrl(id: number): string {
    return this.configSvc.getAttachmentUrl(id);
  }

  private async getProject(projectId: number) {
    this.projectSvc.projectControllerFindOne(projectId).toPromise()
        .then(
          (result) => {this.project = result;},
          (error) => {
            console.error(`Error retrieving Project for Summary Report:`, error);
            this.project = undefined;
            this.projectReqError = true;
          }
        );
  }

  private async getpublicComments(projectId: number) {
    this.commentSvc.publicCommentControllerFind(projectId).toPromise()
        .then(
          (result) => {this.filteredPublicComments = this.publicComments = [...result];},
          (error) => {
            console.error(`Error retrieving Public Comments for Summary Report:`, error);
            this.publicComments = undefined;
            this.publicCommentsReqError = true;
          }
        );
  }

  private async getSpatialDetails(projectId: number) {
    this.spatialFeatureSvc.spatialFeatureControllerGetForProject(projectId).toPromise()
    .then(
      (result) => {
        this.spatialDetail = this.filteredSpatialDetail = [...result];
        this.commentScopeOpts =  CommentScope.buildCommentScopeOptions(result);
        this.commentScopeOpts = _.remove(this.commentScopeOpts, opt => opt.commentScopeCode !== null); // Don't need All option.
        const mainRptOpt = {commentScopeCode: null, desc: 'Main Report', name: null, scopeId: null} as CommentScopeOpt;
        this.selectedScope = mainRptOpt;
        this.commentScopeOpts.unshift(mainRptOpt);
      },
      (error) => {
        console.error(`Error retrieving Spatil Details for Summary Report:`, error);
        this.spatialDetail = undefined;
        this.spatialDetailReqError = true;
      }
    );
  }

  private async getProjectInteractions(projectId: number) {
    this.interactionSvc.interactionControllerFind(projectId).toPromise()
    .then(
      (result) => {this.interactions = result;},
      (error) => {
        console.error(`Error retrieving Project Interactions for Summary Report:`, error);
        this.interactions = undefined;
        this.interactionsReqError = true;
      }
    );
  }

  private async getProjectAttachments(projectId: number) {
    this.attachmentSvc.attachmentControllerFind(projectId).toPromise()
    .then(
      (result) => {
        this.attachments =  _.orderBy(result, ['attachmentType.code'],['asc']);
      },
      (error) => {
        console.error(`Error retrieving Project Attachments for Summary Report:`, error);
        this.attachments = undefined;
        this.attachmentsReqError = true;
      }
    );
  }

  private doFiltering(nextScope: CommentScopeOpt) {

    // filtering on spatialDetail
    this.filteredSpatialDetail = this.spatialDetail.filter((sDetail) => {
      return (nextScope.commentScopeCode == null || nextScope.commentScopeCode === COMMENT_SCOPE_CODE.OVERALL) 
          || (sDetail.featureType.code === nextScope.commentScopeCode.toLowerCase() &&
              sDetail.featureId == nextScope.scopeId);
    });

    // filtering on publicComments
    this.filteredPublicComments = this.publicComments.filter((comment) => {
      if (!nextScope || nextScope.commentScopeCode == null) {
        return true; // Everything.
      }
      else if (nextScope.commentScopeCode === COMMENT_SCOPE_CODE.OVERALL) {
        return comment.commentScope.code === nextScope.commentScopeCode;
      }
      return comment.commentScope.code === nextScope.commentScopeCode &&
              ((comment.scopeCutBlockId && comment.scopeCutBlockId == nextScope.scopeId) ||
              (comment.scopeRoadSectionId && comment.scopeRoadSectionId == nextScope.scopeId));
    });
  }

  onScopeOptionChanged(selection: CommentScopeOpt) {
    this.scopeOptionChange$.next(selection);
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}

