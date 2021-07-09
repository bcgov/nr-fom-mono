import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
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
    const host = process.env.HOSTNAME? `https://${process.env.HOSTNAME}`: 'http://localhost:4200';
    const fomViewLink = `${host}/admin/a/${project.id}`;

    const to = isProd? districtEmail: (isTest? testEnvTo: 'basil.vandegriend@cgi.com');
    const from = '"FOMDoNotReply" <Do-Not-Reply@gov.bc.ca'; // override default from;

    this.logger.info(`Sending FOM ${project.id} finalized notification email to ${to}`);
    await this.mailerService.sendMail({
      to: to,
      from: from,
      subject: `<${env}> New Final FOM submission received`,
      html: `<h3>FOM ${project.id} ${project.name} ${project.forestClient.name} has been finalized and is available for review.</h3>
        <p>
          Please use this <a href="${fomViewLink}" target="_blank">link</a> to access FOM details.
        </p>
      `
    });
  }
}
