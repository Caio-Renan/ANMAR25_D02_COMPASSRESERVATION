import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { AuthLoginDto } from "./dto/auth-login.dto";
import * as bcrypt from 'bcrypt';
import { AuthForgetDto } from "./dto/auth-forget.dto";
import { User } from "@prisma/client";
import { EmailService } from "src/email/email.service";
import { AuthResetDto } from "./dto/auth-reset.dto";
import { AuthVerifyEmailDto } from "./dto/auth-verify-email.dto";
import { AuthValidateService } from "./authValidate.service";



@Injectable()
export class AuthService {

      private readonly jwtConfig = {
          issuer: 'login',
          audience: 'users',
     }

     constructor(
          private readonly prisma: PrismaService,
          private readonly jwtService: JwtService,
          private readonly userService: UsersService,
          private readonly emailService: EmailService,
          private readonly validationService: AuthValidateService
     ) {}

     private createToken(user: User) {
          return {
               accessToken: this.jwtService.sign(
                    {
                         id: user.id,
                         name: user.name,
                         email: user.email,
                         role: user.role,
                    },
                    {
                         expiresIn: '1 day',
                         subject: String(user.id),
                         issuer: this.jwtConfig.issuer,
                         audience: this.jwtConfig.audience,
                    },
               ),
          };
     }

     private checkForgetToken(token: string) {
          try {
               return this.jwtService.verify(token, {
                    audience: 'users',
                    issuer: 'forget',
               });

          } catch (e) {
               throw new BadRequestException(e)
          }
     }

     async login(dto: AuthLoginDto) {
          const user = await this.validationService.validateUserExistsByEmail(dto.email);

          await this.validationService.validateUserStatus(user);

          await this.validationService.validatePassword(dto, user);

          return this.createToken(user);
     }

     async register(dto: AuthRegisterDto) {

          const user = await this.userService.create(dto);

          return this.createToken(user);
     }

     async forget(dto: AuthForgetDto) {
          const user = await this.validationService.validateUserExistsForRecovery(dto.email);

          if (!user) {
               return { message: 'If the email exists, a recovery link has been sent' };
          }

          const token = this.jwtService.sign(
               {
                    id: user.id,
               },
               {
                    expiresIn: '30 minutes',
                    subject: String(user.id),
                    issuer: 'forget',
                    audience: 'users',
               },
          );

          await this.emailService.sendPasswordRecovery(dto.email, token)

          return { message: 'Password recovery email sent successfully' };
     }

     async reset(dto: AuthResetDto) {
          const payload = this.checkForgetToken(dto.token);

          const userId = payload.id;

          if (!userId) {
               throw new BadRequestException('Token payload does not contain a valid user ID')
          }

          const user = await this.userService.findOne(userId);

          if (!user) {
               throw new NotFoundException('No user found for the provided token')
          }

          const newPassword = await bcrypt.hash(dto.password, 10);

          await this.userService.update(userId, { password: newPassword }, user);

          return { message: 'Password successfully updated' };

     }

     async verifyEmail(dto: AuthVerifyEmailDto){
          const payload = this.jwtService.verify(dto.token, {
               issuer: 'email-verification',
               audience: 'clients',
          });

          const clientId = payload.id;

          if(!clientId) {
               throw new BadRequestException('Invalid Token');
          }

          await this.prisma.client.update({
               where: { id: clientId },
               data: { isEmailVerified: true },
          });

          return { message: 'Email sucessfully verified'};
     }

}