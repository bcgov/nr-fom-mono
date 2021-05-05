import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoadSection } from './entities/road-section.entity';
import { RoadSectionService } from './road-section.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoadSection])],
  providers: [RoadSectionService],
  exports: [],
})
export class RoadSectionModule {}
