import { Injectable } from "@angular/core";
import { Auth } from "aws-amplify";
import type { CognitoUserSession } from "amazon-cognito-identity-js";

export interface CognitoLoginUser {
  username?: string;
  idpProvider?: string;
  roles?: string[];
  authToken?: CognitoUserSession;
  isMinistry?: boolean;
  isForestClient?: boolean;
  clientIds?: string[];
}

@Injectable()
export class AuthService {
  public loginUser: CognitoLoginUser;
  private loggedOut: string;

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

  async init(): Promise<any> {
    /*
        See Aws-Amplify documenation: 
        https://docs.amplify.aws/lib/auth/social/q/platform/js/
        https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    */
    this.loggedOut = this.getParameterByName("loggedout");

    return new Promise(async (resolve, reject) => {
      console.log(
        'sessionStorage.getItem("FOM_LOGIN_USER")',
        sessionStorage.getItem("FOM_LOGIN_USER")
      );
      console.log("this.loggedOut", this.loggedOut);

      if (this.loggedOut === "true") resolve(null);
      else {
        if (!sessionStorage.getItem("FOM_LOGIN_USER")) {
          await this.login();
        }

        Auth.currentAuthenticatedUser()
          .then(async (_userData) => {
            console.log("_userData", _userData);
            await this.refreshToken();
            resolve(null);
          })
          .catch(async (error) => {
            console.log("There is no user logged in", error);
            reject();
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

      const cognitoLoginUser = this.parseToken(currentAuthToken);
      this.loginUser = cognitoLoginUser;
      sessionStorage.setItem("FOM_LOGIN_USER", cognitoLoginUser.username);
    } catch (error) {
      console.error("Problem refreshing token or token is invalidated:", error);
      // logout and redirect to login.
      this.logout();
    }
  }

  /**
   * See OIDC Attribute Mapping mapping reference:
   *      https://github.com/bcgov/nr-forests-access-management/wiki/OIDC-Attribute-Mapping
   * Note, current user data return for 'userData.username' is matched to "cognito:username" on Cognito.
   * Which isn't what we really want to display. The display username is "custom:idp_username" from token.
   */
  parseToken(authToken: CognitoUserSession): CognitoLoginUser {
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

  async login() {
    await Auth.federatedSignIn();
    console.log("User logged in.");
  }

  logout() {
    Auth.signOut();
    this.loginUser = undefined;
    console.log("User logged out.");
    sessionStorage.removeItem("FOM_LOGIN_USER");
  }

  getUser() {
    console.log("loginUser", this.loginUser);
    return this.loginUser;
  }
}
