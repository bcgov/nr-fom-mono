import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import dayjs = require('dayjs');
import { PinoLogger } from 'nestjs-pino';
import { Project } from '../../app/modules/project/project.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private logger: PinoLogger) {}

  async sendDistrictNotification(project: Project) {
    const env = process.env.ENV || 'dev';
    const isProd = (env == 'prod');
    const isTest = (env == 'test');
    const districtEmail = project.district.email; // production
    const testEnvTo = 'FLNR.AdminServicesCariboo@gov.bc.ca'; // test

    const to = isProd? districtEmail: (isTest? testEnvTo: 'basil.vandegriend@cgi.com');
    const from = isProd? '"FOMDoNotReply" <FOM.Admin@gov.bc.ca>': '"FOMDoNotReply" <FOM.Admin@gov.bc.ca>' // override default from;
    const districtName = project.district.name;

    this.logger.info(`Environment: ${env}`);
    this.logger.info(`Sending FOM ${project.id} finalized notification email to ${to}`);

    await this.mailerService.sendMail({
      to: to,
      from: from,
      subject: 'New Final FOM submission received',
      template: './ministry-notification', // `.hbs` extension is appended automatically
      context: {
        id: project.id,
        name: project.name,
        finalizedDate: dayjs().format('YYYY-MM-DD'),
        fspId: project.fspId,
        district: districtName,
        holder: project.forestClient.name,
        description: project.description,
        fomViewLink: '[TODO]'
      },
    });
  }
}
