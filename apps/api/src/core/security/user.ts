
// TODO: Cloned to Admin/src/core/services

// Represents a user's information extracted from Keycloak JWT.
export class User {
    userName: string; 
    displayName: string;
    isMinistry: boolean = false;
    isForestClient: boolean = false;
    clientIds: string[] = [];
  
    isAuthorizedForAdminSite():boolean {
      return this.isMinistry || this.isForestClient;
    }
    
    isAuthorizedForClientId(clientId:string):boolean {
      return (this.clientIds.findIndex(x => x == clientId) != -1);
    }
  
    static convertJwtToUser(jwt: any): User {
      const user = new User();
      user.userName = jwt['username'];
      user.displayName = jwt['displayName'];
      var roles: string[];
      if (jwt['resource_access'] && jwt['resource_access']['fom']) {
        roles = jwt['resource_access']['fom']['roles'];
      }
      roles.forEach(role => {
        if (role == 'fom_ministry') {
          user.isMinistry = true;
        }
        if (role.startsWith('fom_forest_client')) {
          user.isForestClient = true;
          const clientStartIndex = 'fom_forest_client_'.length;
          if (role.length > clientStartIndex) {
            const clientId = role.substr(clientStartIndex);
            user.clientIds.push(clientId);
          }
        }
      })
  
      // JWT Structure in development - TODO: Confirm whether same in prod
      // realm_access.roles []
      // resource_access.fom.roles = fom_ministry, fom_forest_client
      // resource_access.account.roles []
      // name
      // displayName
      // username
      // preferred_username
      // email
      // typ = Bearer
      // azp = fom
      // iss = https://dev.oidc.gov.bc.ca/auth/realms/ichqx89w
  
      return user;
    }
    
  }
  