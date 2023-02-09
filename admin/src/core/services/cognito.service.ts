import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Auth } from "aws-amplify";
import { User } from "@utility/security/user";
import type { CognitoUserSession } from "amazon-cognito-identity-js";

export interface CognitoLoginUser {
  username?: string;
  idpProvider?: string;
  roles?: string[];
  authToken?: CognitoUserSession;
}

@Injectable()
export class CognitoService {
  public cognitoLoginUser: CognitoLoginUser;
  private loggedOut: string;
  public initialized: boolean = false;

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
  private parseToken(authToken: CognitoUserSession): CognitoLoginUser {
    const decodedIdToken = authToken.getIdToken().decodePayload();
    const decodedAccessToken = authToken.getAccessToken().decodePayload();
    const cognitoLoginUser = {
      username: decodedIdToken["custom:idp_username"],
      idpProvider: decodedIdToken["identities"]["providerName"],
      roles: decodedAccessToken["cognito:groups"],
      authToken: authToken,
    };
    return cognitoLoginUser;
  }

  public async init(): Promise<any> {
    /*
        See Aws-Amplify documenation: 
        https://docs.amplify.aws/lib/auth/social/q/platform/js/
        https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    */
    this.loggedOut = this.getParameterByName("loggedout");

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

      const cognitoLoginUser = this.parseToken(currentAuthToken);
      this.cognitoLoginUser = cognitoLoginUser;
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
    this.cognitoLoginUser = undefined;
    console.log("User logged out.");
  }

  public getUser() {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const user = User.convertAwsCognitoJwtToUser(token);
    console.log("User " + JSON.stringify(user));

    return user;
  }

  public getToken(): object {
    if (this.cognitoLoginUser && this.cognitoLoginUser.authToken)
      return {
        id_token: this.cognitoLoginUser.authToken.getIdToken().decodePayload(),
        access_token: this.cognitoLoginUser.authToken
          .getAccessToken()
          .decodePayload(),
      };
    return null;
  }

  public getLogoutURL(): string {
    const postLogoutUrl =
      window.location.origin + "/admin/not-authorized?loggedout=true";

    return `https://dev-fam-user-pool-domain.auth.ca-central-1.amazoncognito.com/logout?client_id=6c9ieu27ik29mq75jeb7rrbdls&logout_uri=${postLogoutUrl}`;
  }
}
