import { Injectable } from "@angular/core";
import { Auth } from "aws-amplify";

@Injectable()
export class AuthService {
  async login(): Promise<any> {
    /*
        See Aws-Amplify documenation: 
        https://docs.amplify.aws/lib/auth/social/q/platform/js/
        https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    */

    Auth.federatedSignIn()
      .then((cred) => {
        // If success, you will get the AWS credentials
        console.log("cred", cred);
        return Auth.currentAuthenticatedUser();
      })
      .then((user) => {
        // If success, the user object you passed in Auth.federatedSignIn
        console.log("user", user);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }
}
