import { Component, OnDestroy, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { UrlService } from '@public-core/services/url.service';
import { Filter, FilterUtils, IMultiFilterFields, MultiFilter } from '../utils/filter';
import { Panel } from '../utils/panel.enum';
import { IFiltersType, IUpdateEvent } from '../projects.component';
import * as _ from 'lodash';
import { ProjectService, WorkflowStateCode } from '@api-client';
import { DELIMITER } from '@public-core/utils/constants/constantUtils';
import * as moment from 'moment';

/**
 * Find side panel.
 *
 * @export
 * @class FindPanelComponent
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-find-panel',
  templateUrl: './find-panel.component.html',
  styleUrls: ['./find-panel.component.scss']
})
export class FindPanelComponent implements OnDestroy, OnInit {
  @Output() update = new EventEmitter<IUpdateEvent>();
  @Input() loading: boolean; // from projects component
  
  public filterHash: string;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  public workflowState: _.Dictionary<WorkflowStateCode>;
  public forestClientNameFilter = new Filter<string>({ filter: { queryParam: 'fcName', value: null }});
  public commentStatusFilters: MultiFilter<boolean>; // For 'Commenting Open' or 'Commenting Closed'.
  public postedOnAfterFilter = new Filter<Date>({ filter: { queryParam: 'pdOnAfter', value: null } });
  readonly minDate = moment('2018-03-23').toDate(); // first app created
  readonly maxDate = moment().toDate(); // today

  constructor(public urlSvc: UrlService,
              private projectSvc: ProjectService) {
  }

  ngOnInit(): void {

    this.urlSvc.onNavEnd$
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.loadQueryParameters();
          if (this.areFiltersSet()) {
            this.emitUpdate({ search: false, resetMap: false, hidePanel: false });
          }
    });

    this.projectSvc.workflowStateCodeControllerFindAll()
        .pipe(take(1)).subscribe((data) => {
          const workflowStateCodes = _.chain(data).keyBy('code')
                                  .pick(['COMMENT_OPEN','COMMENT_CLOSED']) // only pick 'COMMENT_OPEN','COMMENT_CLOSED' for select options
                                  .value();
          /*                        
            Note for two values in this filter:
            'Commenting Open'(UI) -> 'includeCommentOpen = true'(API arg) -> matches to (WorkflowStateEnum.COMMENT_OPEN)
            'Commenting Closed'(UI) -> 'includePostCommentOpen = true'(API arg) -> matches to (WorkflowStateEnum.COMMENT_CLOSED, WorkflowStateEnum.FINALIZED)

            For now, borrow workflowStateCodes.COMMENT_OPEN/COMMENT_CLOSED for queryParam and for displayString.
          */
          this.commentStatusFilters = new MultiFilter<boolean>({
            queryParamsKey: 'cmtStatus',
            filters: [
              { queryParam: workflowStateCodes.COMMENT_OPEN.code, 
                displayString: workflowStateCodes.COMMENT_OPEN.description, value: true },
              { queryParam: workflowStateCodes.COMMENT_CLOSED.code, 
                displayString: workflowStateCodes.COMMENT_CLOSED.description, value: false }
            ]
          });  
    });
  }

  /**
   * Computes a hash based on the current filters, updates the local filterHash value if the newly computed hash is
   * different from the current hash, and returns true if the hash was updated, or false otherwise.
   *
   * @returns {boolean}
   * @memberof FindPanelComponent
   */
  public checkAndSetFiltersHash(): boolean {
    const newFilterHash = FilterUtils.hashFilters(
      this.forestClientNameFilter,
      this.commentStatusFilters,
      this.postedOnAfterFilter);

    if (this.filterHash === newFilterHash) {
      return false;
    }

    this.filterHash = newFilterHash;
    return true;
  }

  /**
   * Toggles the filters boolean value.
   *
   * @param {IMultiFilterFields} filter
   * @memberof ExplorePanelComponent
   */
     public toggleFilter(filter: IMultiFilterFields<boolean>) {
      filter.value = !filter.value;
    }

  /**
   * Emit the current selected filters to the parent, if the filters have changed since the last time emit was called.
   *
   * @memberof FindPanelComponent
   */
  public emitUpdate(updateEventOptions: IUpdateEvent) {
    if (this.checkAndSetFiltersHash()) {
      this.update.emit({ ...updateEventOptions, filters: this.getFilters() });
    }
  }

  /**
   * Gets any query parameters from the URL and updates the local filters accordingly.
   *
   * @memberof FindPanelComponent
   */
  public loadQueryParameters(): void {
    this.forestClientNameFilter.filter.value = this.urlSvc.getQueryParam(
      this.forestClientNameFilter.filter.queryParam
    );

    const commentStatusQueryParams = (this.urlSvc.getQueryParam(this.commentStatusFilters.queryParamsKey) || '').split(DELIMITER.PIPE);
    const csParamsNotPresent = !commentStatusQueryParams || commentStatusQueryParams.length == 0 || commentStatusQueryParams[0] == '';
    this.commentStatusFilters.filters.forEach(filter => {
      filter.value = filter.queryParam == 'COMMENT_OPEN'? (csParamsNotPresent? true: commentStatusQueryParams.includes(filter.queryParam)) 
                                                        : (csParamsNotPresent? false: commentStatusQueryParams.includes(filter.queryParam)) 
    });
  }

  /**
   * Parses the local filters into the type expected by the parent.
   *
   * @returns {IFiltersType}
   * @memberof FindPanelComponent
   */
  public getFilters(): IFiltersType {
    return { fcName: this.forestClientNameFilter.filter.value,
             cmtStatus: this.commentStatusFilters.getQueryParamsArray(),
             pdOnAfter: this.postedOnAfterFilter.filter.value
             ? moment(this.postedOnAfterFilter.filter.value)
                 .startOf('day')
                 .toDate()
             : null};
  }

  /**
   * Saves the currently selected filters to the url and emits them to the parent.
   *
   * @memberof FindPanelComponent
   */
  public applyAllFilters() {
    this.saveQueryParameters();
    this.emitUpdate({ search: true, resetMap: false, hidePanel: true });
  }

  /**
   * Saves the currently selected filters to the url and emits them to the parent.
   *
   * @memberof ExplorePanelComponent
   */
  public applyAllFiltersMobile() {
    this.saveQueryParameters();
    this.emitUpdate({ search: true, resetMap: false, hidePanel: true });
  }

  /**
   * Save the currently selected filters to the url.
   *
   * @memberof FindPanelComponent
   */
  public saveQueryParameters() {
    this.urlSvc.setQueryParam(
      this.forestClientNameFilter.filter.queryParam,
      this.forestClientNameFilter.filter.value
    );

    this.urlSvc.setQueryParam(this.commentStatusFilters.queryParamsKey, 
                              this.commentStatusFilters.getQueryParamsString());
    
    this.urlSvc.setQueryParam(
      this.postedOnAfterFilter.filter.queryParam,
      this.postedOnAfterFilter.filter.value && moment(this.postedOnAfterFilter.filter.value).format('YYYY-MM-DD')
    );
  }

  /**
   * Resets all filters to their default (null, empty) values.
   * Removes the query parameters from the url.
   *
   * @memberof FindPanelComponent
   */
  public clear() {
    this.clearAllFilters();
    this.saveQueryParameters();
    this.emitUpdate({ search: true, resetMap: true, hidePanel: false });
  }

  /**
   * Resets all filters to their default (null, empty) values.
   *
   * @memberof FindPanelComponent
   */
  public clearAllFilters() {
    this.forestClientNameFilter.reset();
    this.commentStatusFilters.filters.forEach((filter) => {
      if (filter.queryParam == 'COMMENT_OPEN') filter.value = true;
      if (filter.queryParam == 'COMMENT_CLOSED') filter.value = false;
    });
    this.postedOnAfterFilter.reset();
  }
  /**
   * Returns true if at least 1 filter is selected/populated, false otherwise.
   *
   * @returns {boolean}
   * @memberof FindPanelComponent
   */
  public areFiltersSet(): boolean {
    return this.forestClientNameFilter.isFilterSet();
  }

  public showExplorePanel() {
    this.urlSvc.setFragment(Panel.Explore);
  }

  /**
   * On component destroy.
   *
   * @memberof FindPanelComponent
   */
  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
