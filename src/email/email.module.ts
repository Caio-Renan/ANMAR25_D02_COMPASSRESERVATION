import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';


@Module({
     imports: [ MailerModule.forRootAsync({
          useFactory: () => ({
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
             dir: __dirname + '/templates',
             adapter: new PugAdapter(),
             options: {
               strict: true,
             }
           }
         })
     })
     ,
],
     providers: [],
     exports: []
})
export class EmailModule {
     
}