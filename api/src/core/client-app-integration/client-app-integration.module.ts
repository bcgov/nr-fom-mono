import { ClientAppIntegrationService } from '@api-core/client-app-integration/client-app-integration.service';
import { AppConfigModule } from '@api-modules/app-config/app-config.module';
import { AppConfigService } from '@api-modules/app-config/app-config.provider';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        baseURL: configService.get("fcApiBaseUrl"),
        timeout: configService.get("fcApiReqTimeOut"),
        headers: {
            "Accept": "application/json", 
            "X-API-KEY": configService.get("fcApiApiToken")
        }
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [ClientAppIntegrationService],
  exports: [ClientAppIntegrationService],
})
export class ForestClientApiModule {}