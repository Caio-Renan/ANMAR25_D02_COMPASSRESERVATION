import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";


@Injectable()
export class EmailService{

     constructor( private readonly mailerService: MailerService) {}

     async sendPasswordRecovery(name: string, email: string, token: string){
          await this.mailerService.sendMail({
               to: email,
               subject: 'Password Recovery',
               template: 'forget',
               context: {
                    name,
                    token,
               }
          });
     }
}