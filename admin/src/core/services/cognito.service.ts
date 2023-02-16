import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Amplify, Auth } from "aws-amplify";
import { AwsCognitoConfig, KeycloakConfig } from "@api-client";
import { User } from "@utility/security/user";
import { ConfigService } from "@utility/services/config.service";
import { getFakeUser } from "./mock-user";
import type { CognitoUserSession } from "amazon-cognito-identity-js";

@Injectable()
export class CognitoService {
  private awsCognitoConfig: AwsCognitoConfig;
  private keyclaokConfig: KeycloakConfig = {
    url: "",
    siteMinderUrl: "",
    realm: "",
    clientId: "",
    enabled: false,
  };
  private cognitoAuthToken: object;
  private loggedOut: string;
  private fakeUser: User;
  public initialized: boolean = false;

  constructor(private configService: ConfigService, private http: HttpClient) {}

  private getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /**
   * See OIDC Attribute Mapping mapping reference:
   *      https://github.com/bcgov/nr-forests-access-management/wiki/OIDC-Attribute-Mapping
   * The display username is "custom:idp_username" from token.
   */
  private parseToken(authToken: CognitoUserSession): any {
    const decodedIdToken = authToken.getIdToken().decodePayload();
    const decodedAccessToken = authToken.getAccessToken().decodePayload();
    return {
      id_token: decodedIdToken,
      access_token: decodedAccessToken,
      jwtToken: authToken
    };
  }

  /*
      See Aws-Amplify documenation for intgration: 
      https://docs.amplify.aws/lib/auth/social/q/platform/js/
      https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
  */
  public async init(): Promise<any> {

    this.loggedOut = this.getParameterByName("loggedout");
    if (this.loggedOut === "true") {
      this.initialized = false;
      return null;
    }

    let url: string =
      this.configService.getApiBasePath() + "/api/awsCognitoConfig";
    let data = await this.http
      .get(url, { observe: "body", responseType: "json" })
      .toPromise();
    this.awsCognitoConfig = data as AwsCognitoConfig;

    let keycloakUrl: string =
      this.configService.getApiBasePath() + "/api/keycloakConfig";
    let keycloakData = await this.http
      .get(keycloakUrl, { observe: "body", responseType: "json" })
      .toPromise();
    this.keyclaokConfig = keycloakData as KeycloakConfig;

    console.log("Using cognito config = " + JSON.stringify(this.awsCognitoConfig));
    Amplify.configure(this.awsCognitoConfig);

    if (!this.awsCognitoConfig.enabled) {
      this.fakeUser = getFakeUser();
      this.initialized = true;
      return null;
    }

    return new Promise(async (resolve, reject) => {
      if (this.loggedOut === "true") {
        resolve(null);
      } else {
        Auth.currentAuthenticatedUser()
          .then(async (_userData) => {
            console.log("_userData", _userData);
            if (!_userData) {
              await this.login();
            } else {
              await this.refreshToken();
            }
            this.initialized = true;
            resolve(null);
          })
          .catch(async (error) => {
            console.log("There is no current user", error);
            await this.login();
            resolve(null);
          });
      }
    });
  }

  /**
   * Amplify method currentSession() will automatically refresh the accessToken and idToken
   * if tokens are "expired" and a valid refreshToken presented.
   *   // console.log("currentAuthToken: ", currentAuthToken)
   *   // console.log("ID Token: ", currentAuthToken.getIdToken().getJwtToken())
   *   // console.log("Access Token: ", currentAuthToken.getAccessToken().getJwtToken())
   *
   * Automatically logout if unable to get currentSession().
   */
  async refreshToken() {
    try {
      console.log("Refreshing Token...");
      const currentAuthToken: CognitoUserSession = await Auth.currentSession();
      console.log("currentAuthToken: ", currentAuthToken);

      this.cognitoAuthToken = this.parseToken(currentAuthToken);
    } catch (error) {
      console.error("Problem refreshing token or token is invalidated:", error);
      // logout and redirect to login.
      await this.logout();
    }
  }

  updateToken(): Observable<any> {
    return new Observable((observer) => {
      Auth.currentSession()
        .then((refreshed) => {
          console.log("Cognito token refreshed?:", refreshed);
          observer.next();
          observer.complete();
        })
        .catch((err) => {
          console.error("Cognito token refresh error:", err);
          observer.error();
        });

      return {
        unsubscribe() {
          // Deliberately empty
        },
      };
    });
  }

  public async login() {
    await Auth.federatedSignIn();
    console.log("Navigate to user login.");
  }

  public async logout() {
    console.log("User logging out.");
    if (!this.awsCognitoConfig.enabled) {
      this.fakeUser = null;
      return;
    }
    await Auth.signOut();
  }

  public getUser() {
    if (!this.initialized) {
      return null;
    }

    if (!this.awsCognitoConfig.enabled) {
      return this.fakeUser;
    }

    const token = this.getToken();
    if (!token) {
      return null;
    }
    const user = User.convertAwsCognitoJwtToUser(token);
    return user;
  }

  public getToken(): any {
    if (!this.awsCognitoConfig.enabled) {
      return JSON.stringify(this.fakeUser);
    }
    return this.cognitoAuthToken;
  }

  public getLogoutURL(): string {
    const postLogoutUrl =
      window.location.origin + "/admin/not-authorized?loggedout=true";

    if (!this.awsCognitoConfig.enabled) {
      // Not using cognito.
      return postLogoutUrl;
    }

    const cognitoLogoutUrl =
      `${this.awsCognitoConfig.oauth.domain}/logout?client_id=${this.awsCognitoConfig.aws_user_pools_web_client_id}` +
      `&logout_uri=${postLogoutUrl}`;

    const keycloakLogoutUrl =
      this.keyclaokConfig.url +
      "/realms/" +
      this.keyclaokConfig.realm +
      "/protocol/openid-connect/logout?post_logout_redirect_uri=" +
      cognitoLogoutUrl;

    const siteMinderLogoutUrl =
      this.keyclaokConfig.siteMinderUrl +
      "/clp-cgi/logoff.cgi?retnow=1&returl=" +
      keycloakLogoutUrl;

    return siteMinderLogoutUrl;
  }

  public getConfig() {
    return this.awsCognitoConfig;
  }
}
