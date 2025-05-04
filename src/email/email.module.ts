import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EmailService } from "./email.service";
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
          console.warn('Email credentials are missing. Email module will not be initialized.');
          return {};
        }
        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          },
          defaults: {
            from: '"nest-modules" <modules@nestjs.com>',
          },
          template: {
            dir: join(__dirname, '..','common', 'templates'),
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        };
      }
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {

}