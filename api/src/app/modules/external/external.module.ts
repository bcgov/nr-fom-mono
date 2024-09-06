import { Module } from '@nestjs/common';
import { ProjectsByFspExternalModule } from '@src/app/modules/external/projects-by-fsp/projects-by-fsp.module';

/**
 * "External" module provides external facing APIs for other system to 
 * interface with FOM.
 */
@Module({
  imports: [
    ProjectsByFspExternalModule
  ]
})
export class ExternalModule {}
