import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus, Headers } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, KeycloakConfig } from './auth.service';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Get('/keycloakConfig')
  async getKeycloakConfig(): Promise<KeycloakConfig> {
      return this.authService.getKeycloakConfig();
  }

}
