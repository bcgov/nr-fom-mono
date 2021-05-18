import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {

  constructor(private authService: AuthService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest();
    const authHeader:string = request.headers['authorization'];
    if (authHeader) {
      const user = this.authService.verifyToken(authHeader);
      request.headers['user'] = user;
    }
    return next.handle();
  }
}