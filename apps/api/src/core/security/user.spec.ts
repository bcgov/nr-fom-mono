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

});