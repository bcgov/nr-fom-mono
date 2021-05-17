import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user';

import { decode, verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';


export class KeycloakConfig {
    @ApiProperty()
    enabled: boolean = true;

    @ApiProperty()
    url: string;

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

@Injectable()
export class AuthService {
    private config:KeycloakConfig = new KeycloakConfig();

    private jwksClient;

    constructor(private logger: PinoLogger) {
        // Defaults are for local development. Keycloak enabled by default for maximum security.
        this.config.enabled = (process.env.KEYCLOAK_ENABLED || 'true') === 'true';
        this.config.realm = process.env.KEYCLOAK_REALM || 'ichqx89w';
        this.config.url = process.env.KEYCLOAK_URL || 'https://dev.oidc.gov.bc.ca/auth';
        // Other values for Keycloak URL: TEST: https://test.oidc.gov.bc.ca/auth, PROD: https://oidc.gov.bc.ca/auth

        this.logger.info("Keycloak configuration {%o}", this.config);

        this.jwksClient = new JwksClient({
          jwksUri: this.config.getCertsUri(),
          cache: true, // Accept cache defaults
          rateLimit: true,
        });

    }

    getKeycloakConfig():KeycloakConfig {
        return this.config;
    }

    async verifyToken(authorizationHeader: string):Promise<User> {
        const bearer = 'Bearer ';
        if (!authorizationHeader || !authorizationHeader.startsWith(bearer) || authorizationHeader.length <= bearer.length) {
            throw new HttpException("Not authorized.", HttpStatus.FORBIDDEN);
        }
        const tokenStartIndex = bearer.length;
        const token = authorizationHeader.substr(tokenStartIndex);

        if (!this.config.enabled) {
          // Expects token to be a User instance formatted in JSON.
          return Promise.resolve(JSON.parse(token) as User);
        }
        
        const untrustedDecodedToken = decode(token, { complete: true });

        const kid = untrustedDecodedToken.header.kid;

        var key = await this.jwksClient.getSigningKey(kid);
        try {
          var decodedToken = verify(token, key.getPublicKey(), 
            { issuer: this.config.getIssuer(), 
              nonce: untrustedDecodedToken.payload.nonce 
            });
          this.logger.trace("Trusted decoded token = {%o}" + decodedToken);
          return User.convertJwtToUser(decodedToken);
        } catch (err) {
          this.logger.warn("Invalid token {%o}", err);
          throw new HttpException("Not authorized.", HttpStatus.FORBIDDEN);
        }
    }
}
