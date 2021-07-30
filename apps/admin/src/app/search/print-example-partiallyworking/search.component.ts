import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';
import {ProjectService, WorkflowStateEnum} from '@api-client';
import {ProjectResponse} from '@api-client';
import { StateService } from '../../../core/services/state.service';
import { KeycloakService } from '../../../core/services/keycloak.service';
import { User } from "@api-core/security/user";
import { isNil } from 'lodash';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<boolean>();
  private paramMap: ParamMap = null;
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  public user: User;
  public fFspId: number; // filter: FSP ID
  public fStatus: string; // filter: workflowStateCode
  public fDistrict: number; // filter: district id
  public fHolder: string; // filter: part of FOM holder name
  public projects: ProjectResponse[] = [];
  public count = 0;
  public searching = false;
  public statusCodes = this.stateSvc.getCodeTable('workflowResponseCode');
  public districts = this.stateSvc.getCodeTable('district');
  public searched = false;

  @ViewChild('printContent') printEl: ElementRef;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private stateSvc: StateService,
    private keycloakService: KeycloakService,
    public snackBar: MatSnackBar,
    public searchProjectService: ProjectService,
    private modalSvc: ModalService
  ) {
    this.user = this.keycloakService.getUser();
  }

  ngOnInit() {
    // get search terms from route
    this.route.queryParamMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(paramMap => {
      this.paramMap = paramMap;
      this.setInitialQueryParameters();

      if (this.fFspId || this.fStatus || this.fDistrict || this.fHolder) {
        this.doSearch();
      }
    });
  }

  public print(): void {
    console.log("printing...")
    const printContent = this.printEl.nativeElement;
    console.log("printContent: ", printContent)


    // let printContainer: HTMLElement = document.querySelector('#print-container');

    // if (!printContainer) {
    //   printContainer = document.createElement('div');
    //   printContainer.id = 'print-container';
    // } 

    // printContainer.innerHTML = '';

    const elementCopy = this.printEl.nativeElement.cloneNode(true).innerHTML;
    // printContainer.appendChild(elementCopy);
    // document.body.appendChild(printContainer);


    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
            @media print {
          
              .project-info {
                overflow: visible;
              }
          
              button {
                  display: none;
              }
          
              #sifeatureList {
                display: none;
              }
          
              a {
                display: none;
              }



              .bottom-container {
                display: block;
                height: 100%;
                max-height: 100%;
                overflow-y: visible;
                overflow-x: visible;
                table {
                  page-break-before:always !important; 
                  page-break-after: always !important; 
                  page-break-inside: auto; 
                }
            
              }
            }
          </style>
        </head>
        <body onload="window.print();window.close()">${elementCopy}</body>
      </html>`
    );
    popupWin.document.close();
    
    // window.print();

 }

  private doSearch() {
    this.searching = true;
    this.projects = [];
    this.count = 0;

    const workFlowStateCodeArg = this.fStatus === 'undefined'? null: this.fStatus;
    const districtArg = (isNaN(this.fDistrict) || isNil(this.fDistrict))? null : this.fDistrict.toString();
    const fspIdArg = (isNaN(this.fFspId) || isNil(this.fFspId))? null : this.fFspId.toString();
    this.searchProjectService.projectControllerFind(fspIdArg , districtArg, workFlowStateCodeArg, this.fHolder)
      .subscribe(
        projects => {
          this.projects = projects;
          this.count = this.projects.length;
          const limit = 2500;
          if (this.count >= limit) {
            this.modalSvc.openSnackBar({message: `Warning: Maximum of ${limit} search results exceeded -
            not all results have been displayed. Please refine your search criteria.`, button: 'OK'});
          }
        },
        error => {
          console.error('error =', error);
          this.searched = true;
          this.searching = false;
          this.snackBarRef = this.snackBar.open('Error searching foms ...', null, {duration: 3000});
          // this.snackBarRef.onAction().subscribe(() => this.onSubmit()); // commenting out 'action' so user does not click again/and again.
        },
        () => {
          this.searched = true;
          this.searching = false;
        });
  }

  public setInitialQueryParameters() {
    this.fFspId = this.paramMap.get('fFspId')? parseInt(this.paramMap.get('fFspId')): null;
    this.fDistrict = this.paramMap.get('fDistrict')? parseInt(this.paramMap.get('fDistrict')): null;
    this.fStatus = this.paramMap.get('fStatus') || undefined;
    this.fHolder = this.paramMap.get('fHolder') || null;
  }

  public saveQueryParameters() {
    const params: Params = {};

    if (!isNaN(this.fFspId)) {
      params['fFspId'] = this.fFspId;
    }
    if (!isNaN(this.fDistrict)) {
      params['fDistrict'] = this.fDistrict;
    }
    if (this.fStatus !== 'undefined') {
      params['fStatus'] = this.fStatus;
    }
    if (this.fHolder != null) {
      params['fHolder'] = this.fHolder;
    }

    // change browser URL without reloading page (so any query params are saved in history)
    this.location.go(this.router.createUrlTree([], {relativeTo: this.route, queryParams: params}).toString());
  }

  public onSubmit() {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
    this.saveQueryParameters();
    this.doSearch();
  }

  public clearQueryParameters(): void {
    this.fFspId = null;
    this.fDistrict = null;
    this.fStatus = undefined;
    this.fHolder = null;
    this.saveQueryParameters();
    this.projects = [];
    this.count = 0;
    this.searched = false;
  }

  public canAccessComments(project: ProjectResponse): boolean {
    const userCanView = this.user.isMinistry || this.user.isAuthorizedForClientId(project.forestClient.id);
    return userCanView && (project.workflowState['code'] !== 'INITIAL'
                          && project.workflowState['code'] !== 'PUBLISHED');
  }

  public canEditFOM(project: ProjectResponse): boolean {
    const userCanEdit = this.user.isAuthorizedForClientId(project.forestClient.id);
    return userCanEdit && (project.workflowState.code !== WorkflowStateEnum.Finalized
      && project.workflowState.code !== WorkflowStateEnum.Expired);
  }

  public canViewSubmission(project: ProjectResponse): boolean {
    const userCanView = this.user.isAuthorizedForClientId(project.forestClient.id);
    return userCanView && (project.workflowState.code === WorkflowStateEnum.Initial
      || project.workflowState.code === WorkflowStateEnum.CommentClosed);
  }

  ngOnDestroy() {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
