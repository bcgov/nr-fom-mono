import { Component, OnDestroy, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CommentModalComponent } from '../../comment-modal/comment-modal.component';
import { UrlService } from '@public-core/services/url.service';
import { Filter } from '../utils/filter';
import { AttachmentResponse, AttachmentService, ProjectResponse, ProjectService, 
        SpatialFeaturePublicResponse, SpatialFeatureService, SpatialObjectCodeEnum, 
        WorkflowStateCode } from '@api-client';
import * as _ from 'lodash';
import { SpatialTypeMap } from '@public-core/utils/constants/appUtils';
import { ConfigService } from '@utility/services/config.service';

/**
 * Details side panel.
 *
 * @export
 * @class DetailsPanelComponent
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-details-panel',
  templateUrl: './details-panel.component.html',
  styleUrls: ['./details-panel.component.scss']
})
export class DetailsPanelComponent implements OnDestroy, OnInit {
  @Output() update = new EventEmitter();
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  public addCommentModal: NgbModalRef = null;
  public isAppLoading: boolean;
  public project: ProjectResponse;
  public projectSpatialDetail: SpatialFeaturePublicResponse[];
  public currentPeriodDaysRemainingCount = 0;
  public workflowStatus: _.Dictionary<WorkflowStateCode>;
  public projectIdFilter = new Filter<string>({ filter: { queryParam: 'id', value: null } });
  public attachments: AttachmentResponse[];

  constructor(
    public modalService: NgbModal,
    public configService: ConfigService, // used in template
    public urlService: UrlService,
    private projectService: ProjectService,
    private spatialFeatureService: SpatialFeatureService,
    private attachmentService: AttachmentService
  ) {}

  ngOnInit(): void {
    // Note, can't seem to get stateService.ts to get codeTable working here. Instead, subscribe to it.
    this.projectService.workflowStateCodeControllerFindAll()
    .pipe(take(1)).subscribe((data) => {
      this.workflowStatus = _.keyBy(data, 'code');
    });
    
    // subscribe and watch for URL param changes
    this.urlService.onNavEnd$.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(() => {
      this.loadQueryParameters();
      if (!this.projectIdFilter.filter.value) {
        // no project to display
        this.project = null;
      } else if (!this.project || this.project.id.toString() !== this.projectIdFilter.filter.value) {
        // no project yet selected, or different project selected
        this.getProjectDetails();
      }
    });
  }

  /**
   * Fetch project detail and spatial detail based on projectId.
   * @memberof DetailsPanelComponent
   */
  public getProjectDetails() {
    const projectId = parseInt(this.projectIdFilter.filter.value);
    this.isAppLoading = true;
    forkJoin({
      project: this.projectService.projectControllerFindOne(projectId),
      spatialDetail: this.spatialFeatureService.spatialFeatureControllerGetForProject(projectId),
      attachments: this.attachmentService.attachmentControllerFind(projectId)
    })
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((results) => {
      this.project = results.project;
      this.projectSpatialDetail = results.spatialDetail;
      this.attachments = _.orderBy(results.attachments, ['attachmentType.code'],['asc']);
      this.isAppLoading = false;
      this.projectIdFilter.filter.value = this.project.id.toString();
      this.saveQueryParameters();
      this.update.emit(this.project);
    },
    (err) => {
      console.error(err);
      this.isAppLoading = false;
    });
  }

  /**
   * Show the add comment modal.
   * @memberof DetailsPanelComponent
   */
  public addComment() {
    // open modal
    this.addCommentModal = this.modalService.open(CommentModalComponent, {
      backdrop: 'static',
      size: 'lg',
      windowClass: 'comment-modal'
    });
    
    let modalInstance = this.addCommentModal.componentInstance as CommentModalComponent;
    modalInstance.projectId = this.project.id;
    modalInstance.projectSpatialDetail = this.projectSpatialDetail;

    // check result
    this.addCommentModal.result.then(
      () => {
        // saved
        this.addCommentModal = null;
      },
      () => {
        // dismissed
        this.addCommentModal = null;
      }
    );
  }

  /**
   * Get any query parameters from the URL and updates the local filters accordingly.
   * @memberof DetailsPanelComponent
   */
  public loadQueryParameters(): void {
    this.projectIdFilter.filter.value = this.urlService.getQueryParam(this.projectIdFilter.filter.queryParam);
  }

  /**
   * Save the currently selected filters to the url.
   * @memberof DetailsPanelComponent
   */
  public saveQueryParameters() {
    this.urlService.setQueryParam(this.projectIdFilter.filter.queryParam, this.projectIdFilter.filter.value);
  }

  /**
   * Resets all filters to their default (null, empty) values.
   * @memberof DetailsPanelComponent
   */
  public clearAllFilters() {
    this.projectIdFilter.reset();
  }

  /**
   * On component destroy.
   * @memberof DetailsPanelComponent
   */
  ngOnDestroy() {
    if (this.addCommentModal) {
      (this.addCommentModal.componentInstance as CommentModalComponent).dismiss('destroying');
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
