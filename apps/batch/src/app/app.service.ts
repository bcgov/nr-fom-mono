import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Welcome to batch!' };
  }

  @Cron('0 * * * * * ', { timeZone: 'America/Vancouver' })
  testCron() {
    Logger.log('testCron ran.');
  }
}
