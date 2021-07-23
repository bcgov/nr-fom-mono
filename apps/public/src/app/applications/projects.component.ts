import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, UrlTree } from '@angular/router';

import { Observable, Subject, Subscription} from 'rxjs';
import * as operators from 'rxjs/operators';
import * as _ from 'lodash';

import { AppMapComponent } from './app-map/app-map.component';
import { FindPanelComponent } from './find-panel/find-panel.component';
import { DetailsPanelComponent } from './details-panel/details-panel.component';
import { SplashModalComponent } from './splash-modal/splash-modal.component';
import { UrlService } from '@public-core/services/url.service';
import { Panel } from './utils/panel.enum';
import { ProjectPublicSummaryResponse, ProjectService } from '@api-client';
import { Filter, IFilter, IMultiFilter, IMultiFilterFields, MultiFilter } from './utils/filter';
import { COMMENT_STATUS_FILTER_PARAMS, FOMFiltersService, FOM_FILTER_NAME } from '@public-core/services/fomFilters.service';
import { AppUtils } from '@public-core/utils/constants/appUtils';
import { takeUntil } from 'rxjs/operators';

/**
 * Object emitted by child panel on update.
 *
 * @export
 * @interface IUpdateEvent
 */
export interface IUpdateEvent {

  // True if the search was manually initiated (button click), false if it is emitting as part of component initiation.
  search?: boolean;

  // True if the map view should be reset
  resetMap?: boolean;

  // True if the panel should be collapsed
  hidePanel?: boolean;
}

/**
 * Main public site component.
 *
 * @export
 * @class ProjectsComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @ViewChild('appmap', { static: false }) appmap: AppMapComponent;
  @ViewChild('findPanel', { static: false }) findPanel: FindPanelComponent;
  @ViewChild('detailsPanel', { static: false }) detailsPanel: DetailsPanelComponent;

  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  private splashModal: NgbModalRef = null;
  private snackbarRef: MatSnackBarRef<SimpleSnackBar> = null;

  // necessary to allow referencing the enum in the html
  public Panel = Panel;

  // indicates which side panel should be shown
  public activePanel: Panel;
  public loading = false;
  public urlTree: UrlTree;
  public observablesSub: Subscription = null;
  public coordinates: string = null;
  public projectsSummary: Array<ProjectPublicSummaryResponse>;
  public projectsSummary$: Observable<Array<ProjectPublicSummaryResponse>>;
  public totalNumber: number;
  private fomFilters: Map<string, IFilter | IMultiFilter>;
  public commentStatusFilters: MultiFilter<boolean>;
  
  constructor(
    public snackbar: MatSnackBar,
    private modalService: NgbModal,
    private router: Router,
    private projectService: ProjectService,
    public urlService: UrlService,
    private fomFiltersSvc: FOMFiltersService
  ) {
    // watch for URL param changes
    this.urlService.onNavEnd$.pipe(operators.takeUntil(this.ngUnsubscribe)).subscribe(event => {
      this.urlTree = this.router.parseUrl(event.url);

      if (this.urlTree) {
        switch (this.urlTree.fragment) {
          case 'splash':
            this.displaySplashModal();
            break;
          case Panel.find:
            this.closeSplashModal();
            this.activePanel = Panel.find;
            break;
          case Panel.Explore:
            this.closeSplashModal();
            this.activePanel = Panel.Explore;
            break;
          case Panel.details:
            this.closeSplashModal();
            this.activePanel = Panel.details;
            break;
          default:
            this.closeSplashModal();
            break;
        }
      }
    });
  }

  /**
   * @memberof ProjectsComponent
   */
  ngOnInit() {
    this.fomFiltersSvc.filters$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((filters) => {
      this.fomFilters = filters;
      this.commentStatusFilters = AppUtils.copy(this.fomFilters.get(FOM_FILTER_NAME.COMMENT_STATUS)) as MultiFilter<boolean>;
      this.fetchFOMs(this.fomFilters);
    });
  }

  /**
   * Shows the splash modal.
   *
   * @memberof ProjectsComponent
   */
  public displaySplashModal(): void {
    this.splashModal = this.modalService.open(SplashModalComponent, {
      backdrop: 'static',
      windowClass: 'splash-modal'
    });

    this.splashModal.result.then(() => {
      this.splashModal.dismiss();
    });
  }

  /**
   * Closes the splash modal if its open.
   *
   * @memberof ProjectsComponent
   */
  public closeSplashModal(): void {
    if (this.splashModal) {
      this.splashModal.close();
    }
  }

  /**
   * Removes any url fragment.
   *
   * @memberof ProjectsComponent
   */
  public closeSidePanel() {
    if (this.activePanel) {
      this.activePanel = null;
      this.urlService.setFragment(null);
    }
  }

  /**
   * Show snackbar
   *
   * Note: use debounce to delay snackbar opening so we can cancel it preemptively if loading takes less than 500ms
   *
   * @memberof ProjectsComponent
   */
  public showSnackbar = _.debounce(() => {
    this.snackbarRef = this.snackbar.open('Loading applications ...');
  }, 500);

  /**
   * Hides the snackbar.
   *
   * @memberof ProjectsComponent
   */
  public hideSnackbar() {
    // cancel any pending open
    this.showSnackbar.cancel();

    // if snackbar is showing, dismiss it
    // NB: use debounce to delay snackbar dismissal so it is visible for at least 500ms
    _.debounce(() => {
      if (this.snackbarRef) {
        this.snackbarRef.dismiss();
        this.snackbarRef = null;
      }
    }, 500)();
  }

  fetchFOMs(fomFilters: Map<string, IFilter | IMultiFilter>) {
    const commentStatusFilters = fomFilters.get(FOM_FILTER_NAME.COMMENT_STATUS)['filters'] as Array<IMultiFilterFields<boolean>>;
    const commentOpenParam = commentStatusFilters.filter(filter => filter.queryParam == COMMENT_STATUS_FILTER_PARAMS.COMMENT_OPEN)[0].value;
    const commentClosedParam = commentStatusFilters.filter(filter => filter.queryParam == COMMENT_STATUS_FILTER_PARAMS.COMMENT_CLOSED)[0].value;
    const forestClientNameParam = (fomFilters.get(FOM_FILTER_NAME.FOREST_CLIENT_NAME) as Filter<string>).filter.value;
    const openedOnOrAfterParam = (fomFilters.get(FOM_FILTER_NAME.POSTED_ON_AFTER) as Filter<Date>).filter.value?.toISOString().substr(0, 10);

    this.loading = true;
    this.projectService
        .projectControllerFindPublicSummary(
          commentOpenParam.toString(), 
          commentClosedParam.toString(), 
          forestClientNameParam, 
          openedOnOrAfterParam)
        .subscribe((results) => {
          this.projectsSummary = results;
          this.totalNumber = results.length;
          this.loading = false;
          },
          () => this.loading = false,
          () => this.loading = false
        );
  }

  /**
   * Event handler called when Find panel emits an update.
   *
   * @param {IUpdateEvent} updateEvent
   * @memberof ProjectsComponent
   */
  public handleFindUpdate(updateEvent: IUpdateEvent) {

    if (updateEvent.search) {
      this.detailsPanel.clearAllFilters();

      if (this.appmap) {
        this.appmap.unhighlightApplications();
      }
    }

    if (updateEvent.resetMap) {
      this.appmap.resetView(false);
    }

    if (updateEvent.hidePanel) {
      this.closeSidePanel();
    }
  }

  /**
   * Toggles active panel and its corresponding url fragment.
   *
   * @param {Panel} panel panel/fragment to toggle
   * @memberof ProjectsComponent
   */
  public togglePanel(panel: Panel) {
    if (this.urlTree.fragment === panel) {
      this.activePanel = null;
      this.urlService.setFragment(null);
    } else {
      this.activePanel = panel;
      this.urlService.setFragment(panel);
    }
  }

  /**
   * Clears all child component filters and re-fetches FOMs.
   *
   * @memberof ProjectsComponent
   */
  public clearFilters() {
    this.fomFiltersSvc.clearFilters();
  }

  public toggleFilter(filter: IMultiFilterFields<boolean>) {
    if (this.loading) return;
    filter.value = !filter.value;
    this.fomFiltersSvc.updateFilterSelection(FOM_FILTER_NAME.COMMENT_STATUS, this.commentStatusFilters);
  }
  
  /**
   * On component destroy.
   *
   * @memberof ProjectsComponent
   */
  ngOnDestroy() {
    if (this.splashModal) {
      this.splashModal.dismiss();
    }

    if (this.snackbarRef) {
      this.hideSnackbar();
    }
    
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
