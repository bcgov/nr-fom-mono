import { Injectable } from "@angular/core";
import { Auth } from "aws-amplify";

@Injectable()
export class AuthService {
  async init(): Promise<any> {
    /*
        See Aws-Amplify documenation: 
        https://docs.amplify.aws/lib/auth/social/q/platform/js/
        https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    */

    return new Promise((resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then((_userData) => {
          console.log("_userData", _userData);
          if (!_userData) this.login();
          else resolve(null);
        })
        .catch((tokenError) => {
          console.log("token error", tokenError);
          this.login();
        });
    });
  }

  async login() {
    Auth.federatedSignIn();
    console.log("User logged in.");
  }

  async logout() {
    Auth.signOut();
    console.log("User logged out.");
  }
}
