import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import ical from "ical-generator";



@Injectable()
export class EmailService {

     constructor(private readonly mailerService: MailerService) { }

     async sendPasswordRecovery(email: string, token: string) {
          await this.mailerService.sendMail({
               to: email,
               subject: 'Password Recovery',
               template: 'forget',
               context: {
                    token
               }
          });
     }

     async sendEmailVerification(email: string, name: string, verificationUrl: string) {
          await this.mailerService.sendMail({
               to: email,
               subject: 'Email Verification',
               template: 'verify-email',
               context: {
                    name,
                    verificationUrl,
               },
          });
     }

     async sendReservationApprovalEmail(
          email: string,
          name: string,
          startDate: Date,
          endDate: Date,
          spaceName: string,
     ) {
          const calendar = ical({ name: 'Reservation Approval' });

          calendar.createEvent({
               start: startDate,
               end: endDate,
               summary: 'Reservation Approved',
               description: `Your reservation for space ${spaceName} has been approved.`,
          });

          const icsFile = calendar.toString();

          await this.mailerService.sendMail({
               to: email,
               subject: 'Reservation Approved',
               template: 'reservation-approved',
               context: {
                    name,
                    startDate,
                    endDate,
               },
               attachments: [
                    {
                         filename: 'reservation.ics',
                         content: icsFile,
                    },
               ],
          });
     }
}