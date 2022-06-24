import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './project.entity';
import { ProjectAuthService } from './project-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
  ],
  providers: [ProjectAuthService],
  exports: [ProjectAuthService],
})
export class ProjectAuthModule {}
