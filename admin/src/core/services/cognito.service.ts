import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Amplify, Auth } from "aws-amplify";
import { AwsCognitoConfig, KeycloakConfig } from "@api-client";
import { User } from "@utility/security/user";
import { ConfigService } from "@utility/services/config.service";
import { getFakeUser } from "./mock-user";
import type { CognitoUserSession } from "amazon-cognito-identity-js";

@Injectable({
    providedIn: 'root'
})
export class CognitoService {
  public awsCognitoConfig: AwsCognitoConfig;
  private keycloakConfig: KeycloakConfig;
  private cognitoAuthToken: object;
  private loggedOut: string;
  private fakeUser: User;
  public initialized: boolean = false;

  constructor(private configService: ConfigService, private http: HttpClient) {}

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
    else {
      await this.loadRemoteConfig()
      if (!this.awsCognitoConfig.enabled) {
        this.fakeUser = getFakeUser();
        this.initialized = true;
        return null;
      }
      return new Promise<any>((resolve) => {
        return Auth.currentAuthenticatedUser()
        .then(async () => {
            console.log("Signed in...");
            await this.refreshToken();
            this.initialized = true;
            resolve(null)
        })
        .catch((error) => {
            console.log(error);
            this.login();
            // resolve(null) no need for resolve as it will gets redirected.
        })            
      });
    }
  }

  private async loadRemoteConfig() {
    let url: string = this.configService.getApiBasePath() + "/api/awsCognitoConfig";
    this.awsCognitoConfig = await this.http
        .get(url, { observe: "body", responseType: "json" })
        .toPromise() as AwsCognitoConfig;

    console.log("Using cognito config = " + JSON.stringify(this.awsCognitoConfig));
    Amplify.configure(this.awsCognitoConfig);
  }

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
  }

  public async logout() {
    console.log("User logged out.");
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
    const user = User.convertAwsCognitoDecodedTokenToUser(token);
    console.log("User " + JSON.stringify(user));
    return user;
  }

  public getToken(): any {
    if (!this.awsCognitoConfig.enabled) {
      return JSON.stringify(this.fakeUser);
    }
    return this.cognitoAuthToken;
  }
}
