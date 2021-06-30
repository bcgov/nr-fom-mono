import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProjectService } from '@api-modules/project/project.service';

@Injectable()
export class BatchService {

  constructor(
    private projectService: ProjectService
  ) {
  }

  getData(): { message: string } {
    return { message: 'Welcome to batch!' };
  }

  @Cron('0 * * * * * ', { timeZone: 'America/Vancouver' })
  async testCron() {
    const project = await this.projectService.findOne(3);
    Logger.log('testCron ran found project ' + JSON.stringify(project));
  }
}
