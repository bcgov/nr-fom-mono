import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FspTrackerController } from '@src/app/modules/external/fsp-tracker/fsp-tracker.controller';
import { FspTrackerService } from '@src/app/modules/external/fsp-tracker/fsp-tracker.service';
import { ForestClientModule } from '@src/app/modules/forest-client/forest-client.module';
import { Project } from '@src/app/modules/project/project.entity';
import { ProjectModule } from '@src/app/modules/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    ProjectModule,
    ForestClientModule
  ],
  controllers: [FspTrackerController],
  providers: [FspTrackerService]
})
export class FspTrackerExternalModule {}
