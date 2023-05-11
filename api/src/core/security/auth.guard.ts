import { CanActivate, ExecutionContext, Injectable, SetMetadata, createParamDecorator } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PinoLogger } from 'nestjs-pino';
import { AuthService } from './auth.service';

/**
 * `@UserHeader` decorator.
 * Use this decorator when user object is needed. Could be undefined.
 * Use it in conjunction with `AuthGuard` if endpoint may need 'user' object.
 */
export const UserHeader = createParamDecorator( (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user'];
});

/**
 * `AuthGuard` meta information.
 * Use it in conjunction with `AuthGuard` to assist fine grained scenarios logic if needed. 
 */
export const AuthGuardMeta = (...metadata: string[]) => SetMetadata('authGuardMeta', metadata);

// AuthGuard option for scenarios.
export const GUARD_OPTIONS = {
    PUBLIC: 'PUBLIC', // Open to public without checks.
    ANONYMOUS_LIMITED: 'ANONYMOUS_LIMITED', // Mean to be used for 'Open to public' but with 'limited' operational
            // results, depending on internal business logic. In this case, if `authorization` header is present,
            // `AuthGuard` will checks; if not present, will 'skip' the check. Endpoint which uses this option needs
            // to responsible for correct internal business logic for public. 
    SECURED: 'SECURED' // This is the default case if @AuthGuardMeta is not provided (to enforce secure token checking.)
}

/**
 * The `Guard` intercept and guards incoming request to NestJs app before route/controller 
 * invokes the controller handler. See: https://docs.nestjs.com/guards
 * This Guard implements general auth header checking by deligating detail validation
 * to `AuthService.verifyToken()`.
 * 403 status (done by Nest) will be returned when guard checks fails (Promose.resolve(false)).
 * At its successful validation, it also sets one custom meta info: parsed `user` object
 * into originoal request header.
 */
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private authService: AuthService, 
        private logger: PinoLogger) { }

    canActivate(context: ExecutionContext): Promise<boolean> {
        const metaData = this.getMeta(context);
        this.logger.info("AuthGuard will check with option: %o", metaData)
        if (metaData === GUARD_OPTIONS.PUBLIC) {
            return Promise.resolve(true);
        } 

        const request = context.switchToHttp().getRequest();
        const authHeader:string = request.headers?.authorization
        this.logger.debug("AuthGuard - authHeader: %o", authHeader)
        if (authHeader) {
            return this.validateAuthHeader(request, authHeader)
        }

        if (metaData === GUARD_OPTIONS.ANONYMOUS_LIMITED) {
            // Skips and return 'true' if no `authHeader`. 
            // See GUARD_OPTIONS above for scenario.
            return Promise.resolve(true);
        }

        this.logger.info("There is no 'authorization' header in request object.")
        // Note, NestJS expects a '.resolve(false)' from Guard so it can return back 403 error as expected.
        //       If using .reject(), it will have 500 error.
        return Promise.resolve(false);
    }

    // Deligate validation to `authService.verifyToken(authHeader)`.
    async validateAuthHeader(request: any, authHeader: string): Promise<boolean> {
        try {
            const user = await this.authService.verifyToken(authHeader);
            this.logger.debug("Authenticated user = %o", user);
            request.headers['user'] = user;
            return Promise.resolve(true);
        }
        // Need to catch and return NestJS expected "Promise<boolean>" (as.resolve(false)).
        // Throwing an exception directly or Promise.reject() will cause NestJS internal 500 error.
        catch (err) {
            this.logger.warn("AuthGuard checks failed: %o", err);
            return Promise.resolve(false);
        }
    }

    private getMeta(context: ExecutionContext) {
        const guardMeta = this.reflector.getAllAndOverride<string>('authGuardMeta', [
            context.getHandler(),
            context.getClass(),
        ]);
        return guardMeta? guardMeta[0] : GUARD_OPTIONS.SECURED; // default
    }
}