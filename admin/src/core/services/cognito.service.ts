import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Amplify, Auth } from "aws-amplify";
import { AwsCognitoConfig } from "@api-client";
import { User } from "@utility/security/user";
import { ConfigService } from "@utility/services/config.service";
import { getFakeUser } from "./mock-user";
import type { CognitoUserSession } from "amazon-cognito-identity-js";

@Injectable()
export class CognitoService {
  private config: AwsCognitoConfig = {
    enabled: false,
    region: "",
    userPoolsId: "",
    userPoolWebClientId: "",
    mandatorySignIn: true,
    federationTarget: "",
    domain: "",
    scope: [],
    signUpVerificationMethod: "",
    frontendRedirectBaseUrl: "",
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
   * Note, current user data return for 'userData.username' is matched to "cognito:username" on Cognito.
   * Which isn't what we really want to display. The display username is "custom:idp_username" from token.
   */
  private parseToken(authToken: CognitoUserSession): object {
    const decodedIdToken = authToken.getIdToken().decodePayload();
    const decodedAccessToken = authToken.getAccessToken().decodePayload();
    return {
      id_token: decodedIdToken,
      access_token: decodedAccessToken,
    };
  }

  public async init(): Promise<any> {
    /*
        See Aws-Amplify documenation: 
        https://docs.amplify.aws/lib/auth/social/q/platform/js/
        https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    */

    let url: string =
      this.configService.getApiBasePath() + "/api/awsCognitoConfig";
    let data = await this.http
      .get(url, { observe: "body", responseType: "json" })
      .toPromise();
    this.config = data as AwsCognitoConfig;

    const parsedConfig = {
      aws_cognito_region: this.config.region,
      aws_user_pools_id: this.config.userPoolsId,
      aws_user_pools_web_client_id: this.config.userPoolWebClientId,
      aws_mandatory_sign_in: this.config.mandatorySignIn ? "enable" : "disable",
      oauth: {
        domain: `${this.config.domain}.auth.${this.config.region}.amazoncognito.com`,
        scope: this.config.scope,
        redirectSignIn: `${this.config.frontendRedirectBaseUrl}/admin`,
        redirectSignOut: `${this.config.frontendRedirectBaseUrl}/admin/not-authorized?loggedout=true`,
        responseType: this.config.signUpVerificationMethod,
      },
      federationTarget: this.config.federationTarget,
    };

    console.log("Using cognito config = " + JSON.stringify(this.config));
    Amplify.configure(parsedConfig);

    this.loggedOut = this.getParameterByName("loggedout");

    if (!this.config.enabled) {
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
            resolve(null);
          })
          .catch(async (error) => {
            console.log("There is no current user", error);
            await this.login();
            resolve(null);
          });
      }
      this.initialized = true;
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
    await Auth.signOut();
    console.log("User logged out.");
  }

  public getUser() {
    if (!this.config.enabled) {
      return this.fakeUser;
    }

    const token = this.getToken();
    if (!token) {
      return null;
    }
    const user = User.convertAwsCognitoJwtToUser(token);
    // console.log("User " + JSON.stringify(user));
    return user;
  }

  public getToken(): object | undefined {
    if (!this.config.enabled) {
      return { id_token: {}, accessToken: {} };
    }
    return this.cognitoAuthToken;
  }

  public getLogoutURL(): string {
    const postLogoutUrl =
      window.location.origin + "/admin/not-authorized?loggedout=true";

    if (!this.config.enabled) {
      // Not using keycloak.
      return postLogoutUrl;
    }

    return (
      `${this.config.domain}.auth.${this.config.region}.amazoncognito.com/` +
      `logout?client_id=${this.config.userPoolWebClientId}&logout_uri=${postLogoutUrl}`
    );
  }
}
