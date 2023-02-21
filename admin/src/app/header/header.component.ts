import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from "@utility/security/user";
import { ConfigService } from '@utility/services/config.service';
// import { KeycloakService } from "../../core/services/keycloak.service";
import { CognitoService } from "../../core/services/cognito.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('toggleNav', [
      state('navClosed', style({height: '0'})),
      state('navOpen', style({height: '*'})),
      transition('navOpen => navClosed', [animate('0.2s')]),
      transition('navClosed => navOpen', [animate('0.2s')])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  isNavMenuOpen = true; 
  environmentDisplay: string;
  logoutMsg: string = "Logout";
  user: User;

  constructor(
    //private keycloakService: KeycloakService, 
    private configService: ConfigService, 
    public router: Router, 
    private cognitoService: CognitoService
  ) {
    this.environmentDisplay = configService.getEnvironmentDisplay();
    // this.user = this.keycloakService.getUser();
    this.user = this.cognitoService.getUser();
    if (this.user) {
      this.logoutMsg += ' ' + this.user.displayName;
    }
  }

  ngOnInit() {
    if (!this.user || !this.user.isAuthorizedForAdminSite()) {
      // If on not-authorized page, or if just logged out, don't redirect to not-authorized page as would cause an infinite loop.
      if (window.location.href.indexOf('/not-authorized') == -1 && window.location.href.indexOf("loggedout=true") == -1) {
        this.router.navigate(['/not-authorized']);
      }
    }
  }

  // navigateToLogout() {
  //   this.keycloakService.logout();
  //   window.location.href = this.keycloakService.getLogoutURL();
  // }

  async navigateToLogout() {
    await this.cognitoService.logout();
    window.location.href = this.cognitoService.getLogoutURL();
  }

  toggleNav() {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

  closeNav() {
    this.isNavMenuOpen = false;
  }
}