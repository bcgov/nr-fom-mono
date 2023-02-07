import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService, AwsCognitoConfig, KeycloakConfig } from './auth.service';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Get('/keycloakConfig')
  @ApiResponse({ status: HttpStatus.OK, type: KeycloakConfig })
  async getKeycloakConfig(): Promise<KeycloakConfig> {
      return this.authService.getKeycloakConfig();
  }

  @Get('/awsCognitoConfig')
  @ApiResponse({ status: HttpStatus.OK, type: AwsCognitoConfig })
  async getAwsCognitoConfig(): Promise<AwsCognitoConfig> {
      return this.authService.getAwsCognitoConfig();
  }

}
