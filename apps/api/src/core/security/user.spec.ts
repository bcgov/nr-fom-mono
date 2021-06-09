import { User } from "./user";

describe('User', () => {
    let user: User;

    beforeEach(()=> {
        user = new User();
    });

    describe('isAuthorizedForClientId', () => {
        it('true on match', async () => {
            user.clientIds.push('1011');
            expect(user.isAuthorizedForClientId('1011')).toBe(true);
        });
        it ('false when no match', () => {
            expect(user.isAuthorizedForClientId('1011')).toBe(false);
        });
    });

    describe('convertJsonToUser', () => {
        it('should have client ids', async() => {
            const json = `{"isMinistry":true,"isForestClient":true,"clientIds":[1011, 1012],"userName":"fakeuser@idir","displayName":"Longlastname, Firstname"}`;
            user = User.convertJsonToUser(json);
            expect(user.clientIds.length).toBe(2);            
        });
        it('should have methods', async() => {
            const json = `{"isMinistry":true,"isForestClient":true,"clientIds":[1011, 1012],"userName":"fakeuser@idir","displayName":"Longlastname, Firstname"}`;
            user = User.convertJsonToUser(json);
            expect(user.isAuthorizedForClientId('1011')).toBe(true);            
        });
    });

    describe('convertJwtToUser', () => {
        it('should fail if no roles', async() => {
            const jwt = '{"scope":"openid profile email","idir_userid":"E1234","email_verified":false,"displayName":"Last, First IIT:EX","name":"First Last","preferred_username":"firstlast@idir","given_name":"First","family_name":"Last","email":"first.last@gov.bc.ca","username":"firstlast@idir"}​​​​​​​';
            user = User.convertJwtToUser(jwt);
            expect(user.clientIds.length).toBe(0);
            expect(user.isAuthorizedForAdminSite()).toBeFalsy();
        });
    });
});