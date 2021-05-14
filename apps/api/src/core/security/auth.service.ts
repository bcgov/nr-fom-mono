import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ApiProperty } from '@nestjs/swagger';

export class KeycloakConfig {
    @ApiProperty()
    enabled: boolean = true;

    @ApiProperty()
    url: string;

    @ApiProperty()
    realm: string;

    @ApiProperty()
    clientId: string = 'fom';
  }

@Injectable()
export class AuthService {
    config:KeycloakConfig = new KeycloakConfig();

    constructor(logger: PinoLogger) {
        // Defaults are for local development.
        this.config.enabled = (process.env.KEYCLOAK_ENABLED || 'false') === 'true';
        this.config.realm = process.env.KEYCLOAK_REALM || 'ichqx89w';
        this.config.url = process.env.KEYCLOAK_URL || 'https://dev.oidc.gov.bc.ca/auth';
        // Other values for URL: TEST: https://test.oidc.gov.bc.ca/auth, PROD: https://oidc.gov.bc.ca/auth
    }

    getKeycloakConfig():KeycloakConfig {
        return this.config;
    }

    validateToken(authorizationHeader: string) {
        // TODO: 
    }

}