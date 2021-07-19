import { User } from "./user";

export function getFakeUser():User {
  const userType:string = 'AllAccess'; // NoAccess, ForestClient, Ministry, AllAccess
  switch (userType) {
    case 'NoAccess':
      return getFakeNoAccessUser();
    case 'ForestClient':
      return getFakeForestClientUser();
    case 'Ministry':
      return getFakeMinistryUser();
    case 'AllAccess':
      return getFakeAllAccessUser();
    default:
      return null;
  }
}

export function getFakeNoAccessUser(): User {
  const user = new User();
  user.userName = 'fakeNoAccessUser';
  user.displayName = 'No Access User';
  user.isMinistry = false;
  user.isForestClient = false;
  return user;
}

export function getFakeMinistryUser(): User {
  const user = new User();
  user.userName = 'fakeMinstryUser';
  user.displayName = 'Ministry User';
  user.isMinistry = true;
  user.isForestClient = false;
  return user;
}

export function getFakeForestClientUser(): User {
  const user = new User();
  user.userName = 'fakeForestClientUser';
  user.displayName = 'Forest Client User';
  user.isMinistry = false;
  user.isForestClient = true;
  user.clientIds.push('1011')
  user.clientIds.push('1012');
  return user;
}

export function getFakeAllAccessUser(): User {
  const user = new User();
  user.userName = 'fakeAllAccessUser';
  user.displayName = 'All Access User';
  user.isMinistry = true;
  user.isForestClient = true;
  user.clientIds.push('1011')
  user.clientIds.push('1012');
  return user;
}
