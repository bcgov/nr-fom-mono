import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Todo: Either rename this class or refactor methods.
 *
 * @export
 * @class ApiService
 */
@Injectable()
export class ApiService {
  public isMS: boolean; // IE, Edge, etc
  public apiPath: string;
  public env: string;

  constructor(private http: HttpClient) {
    // const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
    // this.token = currentUser && currentUser.token;
    this.isMS = window.navigator.msSaveOrOpenBlob ? true : false;

    // In index.html we load a javascript file with environment-specific settings, 
    // populated from mounted ConfigMap in OpenShift. This file sets window.localStorage settings
    // Locally, this will be empty and local defaults will be used.

    const envName = window.localStorage.getItem('fom_environment_name');
    this.env = (envName == undefined || envName.length == 0) ? 'local' : envName;

    const { hostname } = window.location;
    if (hostname == 'localhost') {
      this.apiPath = 'http://localhost:3333/api';
    } else if (hostname.includes('nr-fom-public') && hostname.includes('devops.gov.bc.ca')) {
      // TODO: This is the old hostname format, to be removed.
      this.apiPath = 'https://'+hostname.replace('fom-public','fom-api'); 
      if (!hostname.endsWith('/')) {
        this.apiPath += '/';
      }
      this.apiPath += 'api';
    } else {
      // Using single URL for both Public & API
      this.apiPath = 'https://' + hostname + '/api';
    }

  }

  getAttachmentUrl(id: number): string {
    return id ? this.apiPath + '/attachment/file/' + id : '';
  }
}
