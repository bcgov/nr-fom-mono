import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RetentionArea } from './entities/retention-area.entity';
import { RetentionAreaService } from './retention-area.service';
import {
  RetentionAreaController,
  RetentionAreasController,
} from './retention-area.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RetentionArea])],
  controllers: [RetentionAreaController, RetentionAreasController],
  providers: [RetentionAreaService],
  exports: [],
})
export class RetentionAreaModule {}
