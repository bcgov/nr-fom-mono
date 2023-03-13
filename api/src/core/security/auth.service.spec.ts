import { AuthService } from "@api-core/security/auth.service";
import { mockLoggerFactory } from "../../app/factories/mock-logger.factory";
import * as aswCognitoEnvJson from '../../assets/aws-cognito-env.json';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
      service = new AuthService(mockLoggerFactory());
    });

    it('Service init succeed with aws config', () => {
        expect(service.getAwsCognitoConfig()).toBeDefined();
        const secEnvEnabled = process.env.SECURITY_ENABLED;
        if (secEnvEnabled != undefined) {
            expect(service.getAwsCognitoConfig().enabled).toBe(secEnvEnabled == 'true')
        }
        else {
            expect(service.getAwsCognitoConfig().enabled).toBe(true)
        }
        expect(service.getAwsCognitoConfig().aws_cognito_domain).toBe(aswCognitoEnvJson.aws_cognito_domain);
        expect(service.getAwsCognitoConfig().aws_cognito_region).toBe(aswCognitoEnvJson.aws_cognito_region);
        expect(service.getAwsCognitoConfig().aws_user_pools_id).toBe(aswCognitoEnvJson.aws_user_pools_id);
        expect(service.getAwsCognitoConfig().aws_user_pools_web_client_id).toBe(aswCognitoEnvJson.aws_user_pools_web_client_id);
        expect(service.getAwsCognitoConfig().oauth).toBe(aswCognitoEnvJson.oauth);
    });
});
