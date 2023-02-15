import { createParamDecorator, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { decode, verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { PinoLogger } from 'nestjs-pino';

import { User } from '@utility/security/user';
import * as aswCognitoEnvJson from '../../../aws-cognito-env.json';

// Both of these decorators requires the global AuthInterceptor to add the User object to the request. If no bearer token is provided, the user object will be null.
/**
 * Use this decorator when anonmyous access is permitted.
 */
export const UserHeader = createParamDecorator( (data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.headers['user'];
});

/**
 * Use this decorator when authenticated access is required.
 */
export const UserRequiredHeader = createParamDecorator( (data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.headers['user'];
  if (user == null) {
    throw new ForbiddenException(); 
  }
  return user;
});

export class KeycloakConfig {
  @ApiProperty()
  enabled: boolean = true;

  // Keycloak Server URL
  @ApiProperty()
  url: string;

  @ApiProperty()
  siteMinderUrl: string;

  @ApiProperty()
  realm: string;

  @ApiProperty()
  clientId: string = 'fom';

  getIssuer(): string {
    return this.url + "/realms/" + this.realm;
  }

  getCertsUri(): string {
    return this.getIssuer() + "/protocol/openid-connect/certs";
  }
}

export class AwsCognitoConfig {
  @ApiProperty()
  enabled: boolean = true;

  @ApiProperty()
  region: string;

  @ApiProperty()
  userPoolsId: string;

  @ApiProperty()
  userPoolWebClientId: string;

  @ApiProperty()
  mandatorySignIn: boolean = true;

  @ApiProperty()
  federationTarget: string = 'COGNITO_USER_POOLS'

  @ApiProperty()
  domain: string; // 'your_cognito_domain'

  @ApiProperty()
  scope: string[] = ['openid'];

  @ApiProperty()
  signUpVerificationMethod: string = 'code'

  @ApiProperty()
  frontendRedirectBaseUrl: string; // Frontend needs. 
}

export enum AUTH_PROVIDER {
    KEYCLOAK = 'KEYCLOAK',
    AWS_COGNITO = 'AWS_COGNITO'
}

@Injectable()
export class AuthService {
    private providedAuth: string;
    private keyCloakconfig:KeycloakConfig = new KeycloakConfig();
    private awsConfig: AwsCognitoConfig;

    private jwksClient;

    constructor(private logger: PinoLogger) {
        this.providedAuth = (process.env.AUTH_PROVIDER || AUTH_PROVIDER.KEYCLOAK); // Default to 'KEYCLOAK' if not provided.
        console.log(`Auth provider: ${this.providedAuth}`)
        // TODO: this part when it is working for aws, can refactor or retire keycloak.
        if (AUTH_PROVIDER.KEYCLOAK === this.providedAuth) {
            // Defaults are for local development. Keycloak enabled by default for maximum security.
            this.keyCloakconfig.enabled = (process.env.KEYCLOAK_ENABLED || 'true') === 'true';
            this.keyCloakconfig.realm = process.env.KEYCLOAK_REALM || 'ichqx89w';
            this.keyCloakconfig.url = process.env.KEYCLOAK_URL || 'https://dev.oidc.gov.bc.ca/auth';
            this.keyCloakconfig.siteMinderUrl = process.env.SITEMINDER_URL || 'https://logontest7.gov.bc.ca';
            // Sample User = {"isMinistry":true,"isForestClient":true,"clientIds":[1011, 1012],"userName":"fakeuser@idir","displayName":"Longlastname, Firstname"}
            // Other values for Keycloak URL: TEST: https://test.oidc.gov.bc.ca/auth, PROD: https://oidc.gov.bc.ca/auth

            this.logger.info("Keycloak configuration %o", this.keyCloakconfig);

            this.jwksClient = new JwksClient({
                jwksUri: this.keyCloakconfig.getCertsUri(),
                cache: true, // Accept cache defaults
                rateLimit: true,
            });
        }
        else {
            this.awsConfig = Object.assign(new AwsCognitoConfig(), aswCognitoEnvJson);
            console.log(this.awsConfig)
            const jwksUri = `https://cognito-idp.${this.awsConfig.region}.amazonaws.com/${this.awsConfig.userPoolsId}/.well-known/jwks.json`;
            console.log("jwksUri", jwksUri);
            this.jwksClient = new JwksClient({
              jwksUri,
              cache: true, // Accept cache defaults
              rateLimit: true,
            });

            // TODO: Remove this when logout does not need these.
            // Currently for logout chain redirection to work properly to siteminder/Keycloak, these Keycloak settings are 
            // temporary set here for FOM frontend to setup nested chianed logout url to pass during logout process. 
            // When there is a way for Cognito to log user out from Keycloak, this should be removed.
            this.keyCloakconfig.realm = process.env.KEYCLOAK_REALM || 'ichqx89w';
            this.keyCloakconfig.url = process.env.KEYCLOAK_URL || 'https://dev.oidc.gov.bc.ca/auth';
            this.keyCloakconfig.siteMinderUrl = process.env.SITEMINDER_URL || 'https://logontest7.gov.bc.ca';
        }
    }

    getKeycloakConfig(): KeycloakConfig {
        return this.keyCloakconfig;
    }

    getAwsCognitoConfig(): AwsCognitoConfig {
       return this.awsConfig;
    }

    async verifyToken(authHeader: string):Promise<User> {
      if (AUTH_PROVIDER.KEYCLOAK === this.providedAuth) {
        return this.verifyKeycloakToken(authHeader);
      }
      else {
        return this.verifyCognitoToken(authHeader);
      }
    }

    async verifyKeycloakToken(authHeader: string):Promise<User> {
      const bearer = 'Bearer ';
      if (!authHeader || !authHeader.startsWith(bearer) || authHeader.length <= bearer.length) {
        return Promise.reject(new ForbiddenException());
      }
      const tokenStartIndex = bearer.length;
      const token = authHeader.substr(tokenStartIndex);
      if (!this.keyCloakconfig.enabled) {
        const user = User.convertJsonToUser(token);
        return Promise.resolve(user);
      }
      
      try {
        const untrustedDecodedToken = decode(token, { complete: true });
        this.logger.debug("Untrusted decoded token %o", untrustedDecodedToken);
        const kid = untrustedDecodedToken.header.kid;
        var key = await this.jwksClient.getSigningKey(kid);
        const nonce = untrustedDecodedToken.payload['nonce']; // Workaround weird typing of payload able to be a string.
        this.logger.debug("Nonce %o", nonce);
        var decodedToken = verify(token, key.getPublicKey(), 
          { issuer: this.keyCloakconfig.getIssuer(), 
            nonce: nonce
          });
        this.logger.debug("Trusted decoded token = %o", decodedToken);
        return User.convertJwtToUser(decodedToken);
      } catch (err) {
        this.logger.warn("Invalid token %o", err);
        return Promise.reject(new ForbiddenException());
      }
    }

    async verifyCognitoToken(authHeader: string):Promise<User> {
      const bearer = 'Bearer ';
      if (!authHeader || !authHeader.startsWith(bearer) || authHeader.length <= bearer.length) {
        return Promise.reject(new ForbiddenException());
      }
      const tokenStartIndex = bearer.length;
      const token = authHeader.substr(tokenStartIndex);
      const config = this.awsConfig
      if (!config.enabled) {
        const user = User.convertJsonToUser(token);  // TODO: verify this if needs to be changed.
        return Promise.resolve(user);
      }
      
      try {
        const cognitoToken = JSON.parse(token);
        const cognitoAccessToken = cognitoToken['accessToken']['jwtToken'];
        const untrustedDecodedToken = decode(cognitoAccessToken, { complete: true });
        this.logger.debug("Untrusted decoded token %o", untrustedDecodedToken);
        const kid = untrustedDecodedToken.header.kid;
        var key = await this.jwksClient.getSigningKey(kid);
        var decodedToken = verify(token, key.getPublicKey());
        this.logger.debug("Trusted decoded token = %o", decodedToken);
        return User.convertAwsCognitoJwtToUser(decodedToken);
      } catch (err) {
        console.error("err: ", err)
        this.logger.warn("Invalid token: %o", err);
        return Promise.reject(new ForbiddenException());
      }
    }
}
