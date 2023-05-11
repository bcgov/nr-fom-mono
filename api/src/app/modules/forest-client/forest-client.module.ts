import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ForestClient } from './forest-client.entity';
import { ForestClientService } from './forest-client.service';
import { ForestClientController } from './forest-client.controller';
import { SecurityModule } from '@api-core/security/security.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ForestClient]),
    SecurityModule
  ],
  controllers: [ForestClientController],
  providers: [ForestClientService],
  exports: [ForestClientService]
})
export class ForestClientModule {}
