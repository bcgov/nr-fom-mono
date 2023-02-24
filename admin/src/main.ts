import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Amplify } from "aws-amplify";

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

Amplify.configure({
  "aws_mandatory_sign_in": "enable",
  "oauth": {
    "domain": "dev-fam-user-pool-domain.auth.ca-central-1.amazoncognito.com",
    "scope": [
      "openid"
    ],
    "redirectSignIn": "http://fom-316.apps.silver.devops.gov.bc.ca/admin",
    "redirectSignOut": "https://fom-316.apps.silver.devops.gov.bc.ca/admin/not-authorized?loggedout=true",
    "responseType": "code"
  },
  "federationTarget": "COGNITO_USER_POOLS",
  "aws_cognito_domain": "dev-fam-user-pool-domain",
  "aws_cognito_region": "ca-central-1",
  "aws_user_pools_id": "ca-central-1_yds9Vci8g",
  "aws_user_pools_web_client_id": "6c9ieu27ik29mq75jeb7rrbdls"
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.error(err));

  // Junk commit