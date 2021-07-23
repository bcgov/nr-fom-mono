import { Injectable } from '@angular/core';
import { AppUtils } from '@public-core/utils/constants/appUtils';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter, IFilter, IMultiFilter, MultiFilter } from '../../app/applications/utils/filter';

// This const serve as default filters
// Note!! When getting this object, use copy of it 
//        to prevent property value being overwritten from other components.
export const FILTER_FIELD_ENUM = {
  fcNameFilter: { queryParam: 'fcName', value: null },
  postedOnAfterFilter: { queryParam: 'pdOnAfter', value: null },
  commentStatusFilters: {
    queryParamsKey: 'cmtStatus',
    filters: [
      { queryParam: 'COMMENT_OPEN', 
        displayString: 'Commenting Open', value: true },
      { queryParam: 'COMMENT_CLOSED', 
        displayString: 'Commenting Closed', value: false } // default value
    ]
  }
};

/**
 * Service to sync with FOM filters used by components.
 */
@Injectable()
export class FOMFiltersService {

  private _filters$: BehaviorSubject<Map<string, IFilter|IMultiFilter>>;
  public filters$: Observable<Map<string, IFilter|IMultiFilter>>;

  constructor () {
    this._filters$ = new BehaviorSubject(this._getDefaultFilters());
    this.filters$ = this._filters$.asObservable()
    console.log("FiltersService contructing is done...")
  }

  updateFiltersSelection(newFilters: Map<string, IFilter|IMultiFilter>) {
    this._filters$.next(newFilters);
  }

  updateFilterSelection(filterName: string, filter: IFilter|IMultiFilter) {
    const currentFilters = this._filters$.value;
    const nextFilters = new Map();
    Object.assign(nextFilters, currentFilters);
    nextFilters.set(filterName, filter);
    this._filters$.next(nextFilters);
  }

  clearFilter() {
    this._filters$.next(this._getDefaultFilters());
  }

  _getDefaultFilters(): Map<string, IFilter|IMultiFilter> {
    let defaultFilters = new Map();
    const forestClientNameFilter = new Filter<string>({ filter: AppUtils.copy(FILTER_FIELD_ENUM.fcNameFilter)});
    const postedOnAfterFilter = new Filter<Date>({ filter: AppUtils.copy(FILTER_FIELD_ENUM.postedOnAfterFilter) });
    const commentStatusFilters = new MultiFilter<boolean>(AppUtils.copy(FILTER_FIELD_ENUM.commentStatusFilters));
    defaultFilters.set(FILTER_FIELD_ENUM.fcNameFilter.queryParam, forestClientNameFilter);
    defaultFilters.set(FILTER_FIELD_ENUM.postedOnAfterFilter.queryParam, postedOnAfterFilter);
    defaultFilters.set(FILTER_FIELD_ENUM.commentStatusFilters.queryParamsKey, commentStatusFilters);
    return defaultFilters;
  }
}
