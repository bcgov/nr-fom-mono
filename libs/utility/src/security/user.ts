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
  
    static convertJsonToUser(json: string): User {
      const user = new User();
      Object.assign(user, JSON.parse(json)); // Use this syntax to start with a User object so its methods are available.
      return user;
    }

    static convertJwtToUser(jwt: any): User {
      const user = new User();
      user.userName = jwt['username'];
      user.displayName = jwt['displayName'];
      let roles: string[];
      if (jwt['resource_access'] && jwt['resource_access']['fom']) {
        roles = jwt['resource_access']['fom']['roles'];
      }
      if (roles) {
        roles.forEach(role => {
          if (role == 'fom_ministry') {
            user.isMinistry = true;
          }
          if (role.startsWith('fom_forest_client')) {
            user.isForestClient = true;
            const clientStartIndex = 'fom_forest_client_'.length;
            if (role.length > clientStartIndex) {
              const clientId = role.substring(clientStartIndex);
              user.clientIds.push(clientId);
            }
          }
        });
      }
  
      return user;
    }
    
  }
  