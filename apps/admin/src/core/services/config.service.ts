import { Injectable } from '@angular/core';

export function retrieveApiBasePath():string {
  const { hostname } = window.location;
  if (hostname == 'localhost') {
    return 'http://localhost:3333';
  } else if (hostname.includes('nr-fom-admin') && hostname.includes('devops.gov.bc.ca')) {
    // TODO: This is the old hostname format, to be removed.
    return 'https://' + hostname.replace('fom-admin', 'fom-api');
  } else {
    // Using single URL for both Admin & API
    return 'https://' + hostname;
  }
}

@Injectable()
export class ConfigService {

  private environmentDisplay:string;

  private apiBasePath:string;

  constructor() {
    // In index.html we load a javascript file with environment-specific settings,
    // populated from mounted ConfigMap in OpenShift. This file sets window.localStorage settings
    // Locally if empty the local default will be used.

    const envName = window.localStorage.getItem('fom_environment_name');
    this.environmentDisplay = (envName == undefined || envName.length == 0) ? 'local' : envName;
    if (this.environmentDisplay == 'prod') {
      this.environmentDisplay = null;
    }

    this.apiBasePath = retrieveApiBasePath();
    console.log("Using API " + this.apiBasePath);
  }

  // Return the environment to display to users, will be null for production.
  getEnvironmentDisplay(): string {
    return this.environmentDisplay;
  }

  getApiBasePath(): string {
    return this.apiBasePath;
  }
}
