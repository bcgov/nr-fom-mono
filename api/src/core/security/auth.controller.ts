import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, AwsCognitoConfig } from './auth.service';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Get('/awsCognitoConfig')
  @ApiResponse({ status: HttpStatus.OK, type: AwsCognitoConfig })
  async getAwsCognitoConfig(): Promise<AwsCognitoConfig> {
      return this.authService.getAwsCognitoConfig();
  }

}
