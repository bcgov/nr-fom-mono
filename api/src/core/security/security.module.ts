import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthController } from './auth.controller';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

@Module({
  imports: [
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: APP_INTERCEPTOR, useClass: AuthInterceptor }
  ],
  exports: [AuthService],
})
export class SecurityModule {}
