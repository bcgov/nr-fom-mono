import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoadSection } from './entities/road-section.entity';
import { RoadSectionService } from './road-section.service';
import {
  RoadSectionController,
  RoadSectionsController,
} from './road-section.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoadSection])],
  controllers: [RoadSectionController, RoadSectionsController],
  providers: [RoadSectionService],
  exports: [],
})
export class RoadSectionModule {}
