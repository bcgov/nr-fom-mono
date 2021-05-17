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
  }

@Injectable()
export class AuthService {
    config:KeycloakConfig = new KeycloakConfig();

    constructor(private logger: PinoLogger) {
        // Defaults are for local development. Keycloak enabled by default for maximum security.
        this.config.enabled = (process.env.KEYCLOAK_ENABLED || 'true') === 'true';
        this.config.realm = process.env.KEYCLOAK_REALM || 'ichqx89w';
        this.config.url = process.env.KEYCLOAK_URL || 'https://dev.oidc.gov.bc.ca/auth';
        // Other values for URL: TEST: https://test.oidc.gov.bc.ca/auth, PROD: https://oidc.gov.bc.ca/auth

        this.logger.info("Keycloak configuration {%o}", this.config);
    }

    getKeycloakConfig():KeycloakConfig {
        return this.config;
    }

    

    async verifyToken(authorizationHeader: string):Promise<User> {
        const issuer = this.config.url + "/realms/" + this.config.realm;
        const certsUri = issuer + "/protocol/openid-connect/certs";
        const bearer = 'Bearer ';
        if (!authorizationHeader || !authorizationHeader.startsWith(bearer) || authorizationHeader.length <= bearer.length) {
            throw new HttpException("Not authorized.", HttpStatus.FORBIDDEN);
        }
        const tokenStartIndex = bearer.length;
        const token = authorizationHeader.substr(tokenStartIndex);

        if (!this.config.enabled) {
          // TODO: Handle disabled case.
            return Promise.resolve(JSON.parse(token) as User);
        }
        
        const decodedToken = decode(token, { complete: true });
        /*
        Decoded token = {\"header\":
            {\"alg\":\"RS256\",\"typ\":\"JWT\",\"kid\":\"RjlQnJ9W8zDx_jwAReeFGOkiATwICA90VAHjZKzFaeY\"},
            \"payload\":{\"exp\":1621025928,\"iat\":1621025628,\"auth_time\":1621024727,\"jti\":\"3643e1ee-0ce0-48a4-ad4a-a997cd35a47b\",
            \"iss\":\"https://dev.oidc.gov.bc.ca/auth/realms/ichqx89w\",\"sub\":\"36150234-2b50-49a7-bf9a-579c1a8be01d\",\"typ\":\"Bearer\",\"azp\":\"fom\",
            \"nonce\":\"edd30f33-0273-442c-8599-2dc3dd7f7d93\",\"session_state\":\"eedcbb12-95f5-49d1-98d1-cbb2f02ce424\",\"acr\":\"1\",
            \"allowed-origins\":[\"http://localhost:4200\",\"https://nr-fom-admin-working-dev.apps.silver.devops.gov.bc.ca\",\"https://fom-a4b31c-dev.apps.silver.devops.gov.bc.ca\"],
            \"resource_access\":{\"fom\":{\"roles\":[\"fom_ministry\",\"fom_forest_client\"]}},
            \"scope\":\"openid profile email\",
            \"idir_userid\":\"0171BED26FFD4C52B3DAE20651D1EE01\",\"email_verified\":false,
            \"displayName\":\"Vandegriend, Basil IIT:EX\",
            \"name\":\"Basil Vandegriend\",
            \"preferred_username\":\"bvandegr@idir\",
            \"given_name\":\"Basil\",\"family_name\":\"Vandegriend\",
            \"email\":\"basil.vandegriend@gov.bc.ca\",
            \"username\":\"bvandegr@idir\"},
            \"signature\":\"XoNWBCVH-mXr8rC3780OoMTfLSqkk2Jht-v38_2baDJqETiI567qdpRXz2xApmHz5IKSWIG8_WbegchusNzrrXxSHT43331qd77zQd5T6NovQWJ9T2j-KIWrUDTYpDjE3kfBORf8H1Ae_bHpXLa8snk8kJh9d7F5mRIPTl6G2xOCkh3IsoV_pnnGuSbZSFpIh8aSfMfPTs7IHpSdpjnShk0ixNXpPI1fdtZ6J4fIAbgAtCPVby_j_l2kbnjz2xg4q4Uo42k1bTrPkWt0KpGeDWZdMhDicYHLgG-iZmxPWzdEKcyp1lsAWPa5mDHPNyUJehEiNM9yhLukHGUvT6LyPg\"}"}
        */
        this.logger.trace("Decoded token = {%o}" + decodedToken); // TODO: REMOVE

        const kid = decodedToken.header.kid;

        // TODO: Do I need to store this somewhere for the cache to work?
        const client = new JwksClient({
          jwksUri: certsUri,
          cache: true, // Accept cache defaults
          rateLimit: true,
        });

        var key = await client.getSigningKey(kid);
        var signingKey = key.getPublicKey();

        this.logger.info("Signing key outside " + signingKey);
        // throw new HttpException("Not authorized.", HttpStatus.FORBIDDEN);
/*
        var signingKey:string;
        client.getSigningKey(kid, (err, key) => {
            if (err) {
              throw new HttpException("Not authorized.", HttpStatus.FORBIDDEN);
            } else {                
                signingKey = key.getPublicKey();
                this.logger.info("signing key inside = " + signingKey);
                verify(token, signingKey, (error, decodedToken) => {
                  if (error) {
                    this.logger.warn("JSON Web Token Verification Error {}", error);
                  }

                  if (decodedToken) {
                    console.log("***** HAVE TOKEN ***** ");
                  }
                });
                // var decoded = jwt.verify(token, key);
                // this.logger.info("Decoded token = " + JSON.stringify(decodedToken)); // TODO: REMOVE
                //   _verifySecret(currentScopes, tokenString, signingKey, req, callback, sendError);
            }
        });
*/        
        // this.logger.info("Signing key " + signingKey);
        // verify(token, signingKey, (error, decodedToken) => {
        //   if (error) {
        //     this.logger.warn("JSON Web Token Verification Error {}", error);
        //   }
        // });
/*
        jwt.verify(tokenString, secret, function(verificationError, decodedToken) {
          // defaultLog.info("verificationError:", verificationError);
          // defaultLog.info("decodedToken:", decodedToken);
      
          // check if the JWT was verified correctly
          if (verificationError == null && Array.isArray(currentScopes) && decodedToken && decodedToken.realm_access.roles) {
            defaultLog.info('JWT decoded.');
            defaultLog.debug('JWT token:', decodedToken);
      
            // check if the role is valid for this endpoint
            var roleMatch = currentScopes.some(r => decodedToken.realm_access.roles.indexOf(r) >= 0);
            defaultLog.debug('currentScopes', JSON.stringify(currentScopes));
            defaultLog.debug('decodedToken.realm_access.roles', decodedToken.realm_access.roles);
            defaultLog.debug('role match', roleMatch);
      
            // check if the dissuer matches
            var issuerMatch = decodedToken.iss == ISSUER;
            defaultLog.debug('decodedToken.iss', decodedToken.iss);
            defaultLog.debug('ISSUER', ISSUER);
            defaultLog.debug('issuerMatch', issuerMatch);
      
            if (roleMatch && issuerMatch) {
              // add the token to the request so that we can access it in the endpoint code if necessary
              req.swagger.params.auth_payload = decodedToken;
              defaultLog.info('JWT Verified.');
              return callback(null);
            } else {
              defaultLog.info('JWT Role/Issuer mismatch.');
              return callback(sendError());
            }
          } else {
            // return the error in the callback if the JWT was not verified
            defaultLog.warn('JWT Verification Error:', verificationError);
            return callback(sendError());
          }
        });
*/  

        return User.convertJwtToUser(decodedToken.payload);
    }
}

/*
    
    const ISSUER = process.env.SSO_ISSUER || 'https://dev.oidc.gov.bc.ca/auth/realms/prc';
    const JWKSURI =
      process.env.SSO_JWKSURI || 'https://dev.oidc.gov.bc.ca/auth/realms/prc/protocol/openid-connect/certs';
    const JWT_SIGN_EXPIRY = process.env.JWT_SIGN_EXPIRY || '1440'; // 24 hours in minutes.
    const SECRET = process.env.SECRET || 'defaultSecret';
    const KEYCLOAK_ENABLED = process.env.KEYCLOAK_ENABLED || 'true';
    
    exports.verifyToken = function(req, authOrSecDef, token, callback) {
      defaultLog.info('verifying token');
      defaultLog.debug('token:', token);
      // scopes/roles defined for the current endpoint
      var currentScopes = req.swagger.operation['x-security-scopes'];
      function sendError() {
        return req.res.status(403).json({ message: 'Error: Access Denied' });
      }
    
      // validate the 'Authorization' header. it should have the following format:
      //'Bearer tokenString'
      if (token && token.indexOf('Bearer ') == 0) {
        var tokenString = token.split(' ')[1];
    
        // If Keycloak is enabled, get the JWKSURI and process accordingly.  Else
        // use local environment JWT configuration.
        if (KEYCLOAK_ENABLED === 'true') {
          defaultLog.debug('Keycloak Enabled, remote JWT verification.');
          const client = jwksClient({
            strictSsl: true, // Default value
            jwksUri: JWKSURI
          });
    
          const kid = jwt.decode(tokenString, { complete: true }).header.kid;
    
          client.getSigningKey(kid, (err, key) => {
            if (err) {
              defaultLog.error('Signing Key Error:', err);
              callback(sendError());
            } else {
              const signingKey = key.publicKey || key.rsaPublicKey;
    
              _verifySecret(currentScopes, tokenString, signingKey, req, callback, sendError);
            }
          });
        } else {
          defaultLog.debug('proceeding with local JWT verification:', tokenString);
          _verifySecret(currentScopes, tokenString, SECRET, req, callback, sendError);
        }
      } else {
        defaultLog.warn("Token didn't have a bearer.");
        return callback(sendError());
      }
    };
    
    function _verifySecret(currentScopes, tokenString, secret, req, callback, sendError) {
      jwt.verify(tokenString, secret, function(verificationError, decodedToken) {
        // defaultLog.info("verificationError:", verificationError);
        // defaultLog.info("decodedToken:", decodedToken);
    
        // check if the JWT was verified correctly
        if (verificationError == null && Array.isArray(currentScopes) && decodedToken && decodedToken.realm_access.roles) {
          defaultLog.info('JWT decoded.');
          defaultLog.debug('JWT token:', decodedToken);
    
          // check if the role is valid for this endpoint
          var roleMatch = currentScopes.some(r => decodedToken.realm_access.roles.indexOf(r) >= 0);
          defaultLog.debug('currentScopes', JSON.stringify(currentScopes));
          defaultLog.debug('decodedToken.realm_access.roles', decodedToken.realm_access.roles);
          defaultLog.debug('role match', roleMatch);
    
          // check if the dissuer matches
          var issuerMatch = decodedToken.iss == ISSUER;
          defaultLog.debug('decodedToken.iss', decodedToken.iss);
          defaultLog.debug('ISSUER', ISSUER);
          defaultLog.debug('issuerMatch', issuerMatch);
    
          if (roleMatch && issuerMatch) {
            // add the token to the request so that we can access it in the endpoint code if necessary
            req.swagger.params.auth_payload = decodedToken;
            defaultLog.info('JWT Verified.');
            return callback(null);
          } else {
            defaultLog.info('JWT Role/Issuer mismatch.');
            return callback(sendError());
          }
        } else {
          // return the error in the callback if the JWT was not verified
          defaultLog.warn('JWT Verification Error:', verificationError);
          return callback(sendError());
        }
      });
    }
    
*/