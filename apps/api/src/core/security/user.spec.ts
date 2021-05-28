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

});