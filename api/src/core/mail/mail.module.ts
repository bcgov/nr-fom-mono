import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { getMailConfig } from './mail.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: await getMailConfig(),
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        }
      }),
    })
  ],
  providers: [MailService],
  exports: [MailService], //
})
export class MailModule {}
