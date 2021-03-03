import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import configuration from './configuration';
import databaseConfiguration from './database.configuration';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppConfigService extends ReturnType<typeof configuration> {}
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get(key: keyof AppConfigService) {
    return this.configService.get('app.' + key);
  }

  db(key: keyof ReturnType<typeof databaseConfiguration>) {
    return this.configService.get('db.' + key);
  }

  get isDev() {
    return this.env === 'development';
  }
}
