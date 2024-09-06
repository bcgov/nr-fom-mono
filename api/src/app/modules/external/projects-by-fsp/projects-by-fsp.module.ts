import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsByFspController } from '@src/app/modules/external/projects-by-fsp/projects-by-fsp.controller';
import { ProjectsByFspService } from '@src/app/modules/external/projects-by-fsp/projects-by-fsp.service';
import { ForestClientModule } from '@src/app/modules/forest-client/forest-client.module';
import { Project } from '@src/app/modules/project/project.entity';
import { ProjectModule } from '@src/app/modules/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    ProjectModule,
    ForestClientModule
  ],
  controllers: [ProjectsByFspController],
  providers: [ProjectsByFspService]
})
export class ProjectsByFspExternalModule {}
