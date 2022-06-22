import { Injectable } from '@angular/core';

export function retrieveApiBasePath():string {
  const { hostname } = window.location;
  if (hostname == 'localhost') {
    return 'http://localhost:3333';
  } else {
    const apiBasePath = window.localStorage.getItem('fom_api_base_url') as string;
    return apiBasePath;
  }
}

@Injectable()
export class ConfigService {

  private environmentDisplay?:string;

  private apiBasePath:string;

  constructor() {
    // In index.html we load a javascript file with environment-specific settings,
    // populated from mounted ConfigMap in OpenShift. This file sets window.localStorage settings
    // Locally if empty the local default will be used.

    // environmentDisplay adds white text in a green circle to the frontends
    const envName = window.localStorage.getItem('fom_environment_name');
    if (envName == undefined || envName.length == 0 || envName == 'prod' ) {
      this.environmentDisplay = undefined;
    } else {
      this.environmentDisplay = envName;
    }

    this.apiBasePath = retrieveApiBasePath();
    console.log("Using API " + this.apiBasePath);
  }

  // Return the environment to display to users, will be undefined for production.
  getEnvironmentDisplay(): string | undefined {
    return this.environmentDisplay;
  }

  getApiBasePath(): string {
    return this.apiBasePath;
  }

  getAttachmentUrl(id: number): string {
    return id ? this.apiBasePath + '/api/attachment/file/' + id : '';
  }

}
