import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "@utility/security/user";
import { ConfigService } from "@utility/services/config.service";
import { KeycloakService } from "../../core/services/keycloak.service";
import { AuthService } from "../../core/services/auth.service";
import type { CognitoLoginUser } from "../../core/services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  animations: [
    trigger("toggleNav", [
      state("navClosed", style({ height: "0" })),
      state("navOpen", style({ height: "*" })),
      transition("navOpen => navClosed", [animate("0.2s")]),
      transition("navClosed => navOpen", [animate("0.2s")]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  isNavMenuOpen = true;
  environmentDisplay: string;
  logoutMsg: string = "Logout";
  // user: User;
  user: CognitoLoginUser;

  constructor(
    private keycloakService: KeycloakService,
    private configService: ConfigService,
    public router: Router,
    private authService: AuthService
  ) {
    this.environmentDisplay = configService.getEnvironmentDisplay();
    // this.user = this.keycloakService.getUser();
    this.user = this.authService.getUser();
    if (this.user) {
      // this.logoutMsg += " " + this.user.displayName;
      this.logoutMsg += " " + this.user.username;
    }
  }

  ngOnInit() {
    // if (!this.user || !this.user.isAuthorizedForAdminSite()) {
    if (!this.user || !this.user.roles.includes("FOM_REVIEWER")) {
      // If on not-authorized page, or if just logged out, don't redirect to not-authorized page as would cause an infinite loop.
      if (
        window.location.href.indexOf("/not-authorized") == -1 &&
        window.location.href.indexOf("loggedout=true") == -1
      ) {
        this.router.navigate(["/not-authorized"]);
      }
    }
  }

  navigateToLogout() {
    this.authService.logout();
    this.keycloakService.logout();
    window.location.href = this.keycloakService.getLogoutURL();
  }

  toggleNav() {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

  closeNav() {
    this.isNavMenuOpen = false;
  }
}
