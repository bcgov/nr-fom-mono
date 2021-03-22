import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ForestClient } from './entities/forest-client.entity';
import { ForestClientService } from './forest-client.service';
import { ForestClientController } from './forest-client.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ForestClient])],
  controllers: [ForestClientController],
  providers: [ForestClientService],
  exports: []
})
export class ForestClientModule {}
