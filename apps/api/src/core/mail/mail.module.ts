import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { getMailConfig } from './mail.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: await getMailConfig(),
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        template: {
          dir: join(process.cwd(), '/apps/api/src/core/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    })
  ],
  providers: [MailService],
  exports: [MailService], //
})
export class MailModule {}
