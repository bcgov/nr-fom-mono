import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RetentionArea } from './entities/retention-area.entity';
import { RetentionAreaService } from './retention-area.service';
import { RetentionAreaController } from './retention-area.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RetentionArea])],
  controllers: [RetentionAreaController],
  providers: [RetentionAreaService],
  exports: []
})
export class RetentionAreaModule {}
