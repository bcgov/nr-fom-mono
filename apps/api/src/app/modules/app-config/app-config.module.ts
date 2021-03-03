import { Module } from '@nestjs/common';
import configuration, { appValidationSchema } from './configuration';
import { AppConfigService } from './app-config.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfiguration from './database.configuration';
/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      load: [configuration, databaseConfiguration],
      validationSchema: appValidationSchema,
      ignoreEnvVars: true,
      ignoreEnvFile: false
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
