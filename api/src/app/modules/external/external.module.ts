import { Module } from '@nestjs/common';
import { FspTrackerExternalModule } from '@src/app/modules/external/fsp-tracker/fsp-tracker.module';

/**
 * "External" module provides external facing APIs for other system to 
 * interface with FOM.
 */
@Module({
  imports: [
    FspTrackerExternalModule
  ]
})
export class ExternalModule {}
