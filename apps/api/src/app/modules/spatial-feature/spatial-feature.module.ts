import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ForestClientModule } from '../forest-client/forest-client.module';
import { ProjectSpatialDetailService } from './project-spatial-detail.service';
import { ProjectSpatialDetail } from './project-spatial-detail.entity';
import { SubmissionModule } from '../submission/submission.module';
import { SpatialFeatureController } from './spatial-feature.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectSpatialDetail]),
    ForestClientModule,
    SubmissionModule,
  ],
  controllers: [SpatialFeatureController],
  providers: [ProjectSpatialDetailService],
  exports: [ProjectSpatialDetailService],
})
export class SpatialFeatureModule {}
