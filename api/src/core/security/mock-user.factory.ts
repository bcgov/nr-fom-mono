import { User } from "./user";

export function createFakeMinistryUser(): User {
    const user = new User();
    user.userName = 'fakeMinstryUser';
    user.displayName = 'Ministry User';
    user.isMinistry = true;
    user.isForestClient = false;
    return user;
  }
  
export function createFakeForestryUser(): User {
    const user = new User();
    user.userName = 'fakeForestryUser';
    user.displayName = 'Forestry User';
    user.isMinistry = false;
    user.isForestClient = true;
    user.clientIds.push(TEST_CLIENT_ID);
    return user;
  }

export const TEST_CLIENT_ID: string = '1011';

