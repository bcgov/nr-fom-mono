import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import * as moment from 'moment';

import {RxFormBuilder} from '@rxweb/reactive-form-validators';
import {StateService} from '../../../core/services/state.service';
import {User} from "@api-core/security/user";
import {KeycloakService} from "../../../core/services/keycloak.service";

@Component({
  selector: 'app-public-notice-edit',
  templateUrl: './public-notice-edit.component.html',
  styleUrls: ['./public-notice-edit.component.scss']
})
export class PublicNoticeEditComponent implements OnInit, AfterViewInit, OnDestroy {
  user: User;
  projectId: number;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: RxFormBuilder,
    public stateSvc: StateService,
    private keycloakService: KeycloakService,
  ) {
    this.user = this.keycloakService.getUser();
  }

  get isLoading() {
    return this.stateSvc.loading;
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.params.appId;
  }

  ngAfterViewInit() {
  }

  public cancelChanges() {
    this.router.navigate(['/a', this.projectId]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
