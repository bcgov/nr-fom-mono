import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RetentionArea } from './entities/retention-area.entity';
import { RetentionAreaService } from './retention-area.service';

@Module({
  imports: [TypeOrmModule.forFeature([RetentionArea])],
  providers: [RetentionAreaService],
  exports: [],
})
export class RetentionAreaModule {}
