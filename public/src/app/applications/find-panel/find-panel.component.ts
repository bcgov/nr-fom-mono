import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { WorkflowStateCode } from '../../../../../libs/client/typescript-ng';
import { COMMENT_STATUS_FILTER_PARAMS, FOMFiltersService, FOM_FILTER_NAME } from '../../../core/services/fomFilters.service';
import { UrlService } from '../../../core/services/url.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUpdateEvent } from '../projects.component';
import { Filter, FilterUtils, IFilter, IMultiFilter, IMultiFilterFields, MultiFilter } from '../utils/filter';


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
  private fomFilters: Map<string, IFilter | IMultiFilter>;
  public forestClientNameFilter = new Filter<string>({ filter: { queryParam: 'fcName', value: null }});
  public commentStatusFilters: MultiFilter<boolean>; // For 'Commenting Open' or 'Commenting Closed'.
  public postedOnAfterFilter = new Filter<Date>({ filter: { queryParam: 'pdOnAfter', value: null } });
  readonly minDate = moment('2018-03-23').toDate(); // first app created
  readonly maxDate = moment().toDate(); // today

  constructor(public urlSvc: UrlService,
              private fomFiltersSvc: FOMFiltersService) {
  }

  ngOnInit(): void {
    this.fomFiltersSvc.filters$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((filters) => {
      this.fomFilters = filters;
      this.forestClientNameFilter = this.fomFilters.get(FOM_FILTER_NAME.FOREST_CLIENT_NAME) as Filter<string>;
      this.commentStatusFilters = this.fomFilters.get(FOM_FILTER_NAME.COMMENT_STATUS) as MultiFilter<boolean>;
      this.postedOnAfterFilter = this.fomFilters.get(FOM_FILTER_NAME.POSTED_ON_AFTER) as Filter<Date>;
    })
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

  // checking if Comment Status filter both COMMENT_OPEN/COMMENT_CLOSED are false. If it is, default to COMMENT_OPEN.
  public verifyStatus() {
    const commentOpen = this.commentStatusFilters.filters.filter(filter => filter.queryParam == COMMENT_STATUS_FILTER_PARAMS.COMMENT_OPEN)[0];
    const commentClosed = this.commentStatusFilters.filters.filter(filter => filter.queryParam == COMMENT_STATUS_FILTER_PARAMS.COMMENT_CLOSED)[0];
    if (!commentOpen.value && !commentClosed.value) {
      commentOpen.value = true;
    }
  }

  /**
   * Emit the current selected filters to the parent, if the filters have changed since the last time emit was called.
   *
   * @memberof FindPanelComponent
   */
  public emitUpdate(updateEventOptions: IUpdateEvent) {
    if (this.checkAndSetFiltersHash()) {
      this.update.emit({ ...updateEventOptions });
    }
  }

  /**
   * Saves the currently selected filters to the url and emits them to the parent.
   *
   * @memberof FindPanelComponent
   */
  public applyAllFilters() {
    this.fomFiltersSvc.updateFiltersSelection(this.fomFilters);
    this.emitUpdate({ search: true, resetMap: false, hidePanel: true });
  }

  /**
   * Saves the currently selected filters to the url and emits them to the parent.
   *
   * @memberof ExplorePanelComponent
   */
  public applyAllFiltersMobile() {
    this.fomFiltersSvc.updateFiltersSelection(this.fomFilters);
    this.emitUpdate({ search: true, resetMap: false, hidePanel: true });
  }

  /**
   * Resets all filters to their default (null, empty) values.
   * Removes the query parameters from the url.
   *
   * @memberof FindPanelComponent
   */
  public clear() {
    this.clearAllFilters();
    this.emitUpdate({ search: true, resetMap: true, hidePanel: true });
  }

  /**
   * Resets all filters to their default (null, empty) values.
   *
   * @memberof FindPanelComponent
   */
  public clearAllFilters() {
    this.fomFiltersSvc.clearFilters();
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
