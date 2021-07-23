import { Injectable } from '@angular/core';
import { AppUtils } from '@public-core/utils/constants/appUtils';
import { BehaviorSubject, Observable } from 'rxjs';
import { Filter, IFilter, IMultiFilter, MultiFilter } from '../../app/applications/utils/filter';

export enum FOM_FILTER_NAME {
  FOREST_CLIENT_NAME = 'fcName',
  POSTED_ON_AFTER = 'pdOnAfter',
  COMMENT_STATUS = 'cmtStatus'
}

/*
  This const serve as default filters
  Note!! When getting this object, use copy of it 
        to prevent property value being overwritten from other components.
  The object for the properties are based on Interface from filter.ts.
  (However, that inteface definition is kind of strange, may need to refactor later.)
*/
export const DEFAULT_FOM_FILTERS = {
  fcNameFilter: { filter: {queryParam: FOM_FILTER_NAME.FOREST_CLIENT_NAME, value: null }},
  postedOnAfterFilter: { filter: {queryParam: FOM_FILTER_NAME.POSTED_ON_AFTER, value: null }},
  commentStatusFilters: {
    queryParamsKey: FOM_FILTER_NAME.COMMENT_STATUS,
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
    this.filters$ = this._filters$.asObservable();
  }

  updateFiltersSelection(newFilters: Map<string, IFilter|IMultiFilter>) {
    this._filters$.next(newFilters);
  }

  updateFilterSelection(filterName: string, filterToUpdate: IFilter|IMultiFilter) {
    if (!filterName || !(<string[]> Object.values(FOM_FILTER_NAME)).includes(filterName)) { // if we target ES7 in tsconfig, we don't need this cast.
      return; // wrong filter name, no update
    }

    const currentFilters = this._filters$.value;
    let nextFilters = new Map();
    currentFilters.forEach((currentFilter) => {
      let currentFilterName: string;
      if (currentFilter.hasOwnProperty('queryParamsKey')) {
        currentFilterName = currentFilter['queryParamsKey'];
      }
      else {
        currentFilterName = currentFilter['filter']['queryParam'];
      }

      if (currentFilterName === filterName) {
        nextFilters.set(filterName, AppUtils.copy(filterToUpdate));
      }
      else {
        nextFilters.set(currentFilterName, AppUtils.copy(currentFilter));
      }
    });
    this._filters$.next(nextFilters);
  }

  clearFilter() {
    this._filters$.next(this._getDefaultFilters());
  }

  _getDefaultFilters(): Map<string, IFilter|IMultiFilter> {
    let defaultFilters = new Map();
    const forestClientNameFilter = new Filter<string>(AppUtils.copy(DEFAULT_FOM_FILTERS.fcNameFilter));
    const postedOnAfterFilter = new Filter<Date>(AppUtils.copy(DEFAULT_FOM_FILTERS.postedOnAfterFilter));
    const commentStatusFilters = new MultiFilter<boolean>(AppUtils.copy(DEFAULT_FOM_FILTERS.commentStatusFilters));
    defaultFilters.set(FOM_FILTER_NAME.FOREST_CLIENT_NAME, forestClientNameFilter);
    defaultFilters.set(FOM_FILTER_NAME.POSTED_ON_AFTER, postedOnAfterFilter);
    defaultFilters.set(FOM_FILTER_NAME.COMMENT_STATUS, commentStatusFilters);
    return defaultFilters;
  }
}
