import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

import { ForestClientModule } from '../forest-client/forest-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), ForestClientModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: []
})
export class ProjectModule {}
