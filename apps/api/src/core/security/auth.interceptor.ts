import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {

  constructor(private authService: AuthService, private logger: PinoLogger) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest();
    const authHeader:string = request.headers['authorization'];
    if (authHeader) {
      const user = this.authService.verifyToken(authHeader);
      request.headers['user'] = user;
      this.logger.trace("Authenticated user = {%o}", user);
    }
    return next.handle();
  }
}