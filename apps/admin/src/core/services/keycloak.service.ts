import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import * as _ from 'lodash';
import { JwtHelperService } from "@auth0/angular-jwt";
import { ConfigService } from './config.service';
import { HttpClient } from "@angular/common/http";
import { getFakeUser } from './mock-user';

declare var Keycloak: any;

class KeycloakConfig {
  enabled: boolean = true;
  url: string;
  realm: string;
  clientId: string = 'fom';
}

@Injectable()
export class KeycloakService {
  private config: KeycloakConfig;
  private keycloakAuth: any;
  private loggedOut: string;
  private fakeUser: User;
  public initialized: boolean = false;

  constructor(private configService: ConfigService, private http: HttpClient) {
  }

  private getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  async init(): Promise<any> {

    // Cannot call AuthService.authControllerGetKeycloakConfig because this introduces a circular dependency when autowired in the constructor because
    // AuthSerivce needs tokenInterceptor, tokenInterceptor needs KeycloakService. Therefore we just use the HttpClient directly in this init method.
    var url:string = this.configService.getApiBasePath()+"/api/keycloakConfig";
    var data = await this.http.get(url, { observe: "body", responseType: "json"}).toPromise(); 
    this.config = data as KeycloakConfig;

    console.log('Using keycloak config = ' + JSON.stringify(this.config));

    this.loggedOut = this.getParameterByName('loggedout');

    if (!this.config.enabled) {
      this.fakeUser = getFakeUser();
      this.initialized = true;
      return null;
    }

    // Bootup KC
    return new Promise((resolve, reject) => {

      this.keycloakAuth = new Keycloak(this.config);
      // Logging could be done on various events - onAuthSuccess, onAuthError, onAuthRefreshSuccess, onAuthRefreshError, onAuthLogout - but isn't needed.

      // Try to get refresh tokens in the background
      this.keycloakAuth.onTokenExpired = () => {
        this.keycloakAuth
          .updateToken()
          .then(refreshed => {
            console.log('KC refreshed token?:', refreshed);
          })
          .catch(err => {
            console.log('KC refresh error:', err);
          });
      };

      // Initialize
      this.keycloakAuth
        .init({})
        .then(auth => {
          if (!auth) {
            if (this.loggedOut === 'true') {
              // Don't do anything, they wanted to remain logged out.
              resolve(null); 
            } else {
              this.keycloakAuth.login(); // Cannot use IDP hint for two provides { kc_idp_hint: ['idir', 'bceid']}); 
              // If not authorized for FOM, the header-component will route the user to the not-authorized page.
            }
          } else {
            resolve(null);
          }
        })
        .catch(err => {
          console.log('KC error:', err);
          reject();
        });

      this.initialized = true; // This enables TokenInterceptor
    });
  }

  public getUser(): User {
    if (!this.config.enabled) {
       return this.fakeUser;
    } 
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    if (!decodedToken) {
      return null;
    }

    const user = User.convertJwtToUser(decodedToken);
    console.log("User " + JSON.stringify(user)); // TODO:REMOVE

    return user;
  }

  /**
   * Returns the current keycloak auth token.
   *
   * @returns {string} keycloak auth token.
   * @memberof KeycloakService
   */
  public getToken(): string {
    if (!this.config.enabled) {
      return JSON.stringify(this.fakeUser);
    }

    return this.keycloakAuth.token;
  }

  /**
   * Returns an observable that emits when the auth token has been refreshed.
   * Call {@link KeycloakService#getToken} to fetch the updated token.
   *
   * @returns {Observable<string>}
   * @memberof KeycloakService
   */
  refreshToken(): Observable<any> {
    return new Observable(observer => {
      this.keycloakAuth
        .updateToken(30)
        .success(refreshed => {
          console.log('KC refreshed token?:', refreshed);
          observer.next();
          observer.complete();
        })
        .error(err => {
          console.log('KC refresh error:', err);
          observer.error();
        });

      return { unsubscribe() {} };
    });
  }

  logout() {
    if (!this.config.enabled) {
      this.fakeUser = null;
    }
  }

  getLogoutURL(): string {
    const logoutUrl = window.location.origin + '/admin/not-authorized?loggedout=true';

    if (!this.config.enabled) {
      return logoutUrl;
    } 

    return this.keycloakAuth.authServerUrl + '/realms/' + this.config.realm +
      '/protocol/openid-connect/logout?redirect_uri=' + logoutUrl;
    
  }
}
