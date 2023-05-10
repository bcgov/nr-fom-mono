import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ForbiddenException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * TODO: remove this interceptor. No longer working properly after NestJS v8
 */
@Injectable()
export class AuthInterceptor implements NestInterceptor {

  constructor(private authService: AuthService, private logger: PinoLogger) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest();
    const authHeader:string = request.headers['authorization'];
    if (authHeader) {
      this.authService.verifyToken(authHeader).then(user => {
        this.logger.debug("Authenticated user = %o", user);
        request.headers['user'] = user;
      }).catch(err => { 
        throwError(() => new ForbiddenException() );
      });
    }
    return next.handle();
  }
}