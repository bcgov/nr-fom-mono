import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ForestClient } from './forest-client.entity';
import { ForestClientService } from './forest-client.service';
import { ForestClientController } from './forest-client.controller';
import { SecurityModule } from '@api-core/security/security.module';
import { AppConfigModule } from '@api-modules/app-config/app-config.module';
import { ClientAppIntegrationResponse } from '@api-core/client-app-integration/client-app-integration.dto';
import { ClientAppIntegrationModule } from '@api-core/client-app-integration/client-app-integration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ForestClient]),
    SecurityModule,
    AppConfigModule,
    ClientAppIntegrationModule
  ],
  controllers: [ForestClientController],
  providers: [ForestClientService],
  exports: [ForestClientService]
})
export class ForestClientModule {}
