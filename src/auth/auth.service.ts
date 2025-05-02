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



@Injectable()
export class AuthService {

     private issuer = 'login';
     private audience = 'users';

     constructor(
          private readonly prisma: PrismaService,
          private readonly jwtService: JwtService,
          private readonly userService: UsersService,
          private readonly emailService: EmailService,
     ) { }

     private createToken(user: User) {
          return {
               accessToken: this.jwtService.sign(
                    {
                         id: user.id,
                         name: user.name,
                         email: user.email,
                    },
                    {
                         expiresIn: '1 day',
                         subject: String(user.id),
                         issuer: this.issuer,
                         audience: this.audience,
                    },
               ),
          };
     }

     private checkToken(token: string){
          try {
               return this.jwtService.verify(token, {
                    audience: this.audience,
                    issuer: this.issuer,
               });
          
          } catch (e) {
               throw new BadRequestException(e)
          }
     }
     
     async login(dto: AuthLoginDto) {
          const user = await this.prisma.user.findFirst({
               where: {
                    email: dto.email,
               },
          });

          if (!user) {
               throw new NotFoundException('Email not found');
          }

          if (user.status === 'INACTIVE') {
               throw new ForbiddenException('User is inactive');
          }

          const isValidPassword = await bcrypt.compare(dto.password, user.password);

          if (!isValidPassword) {
               throw new UnauthorizedException('Invalid password');
          }

          return this.createToken(user);
     }

     async register(dto: AuthRegisterDto) {

          const user = await this.userService.create(dto);

          return this.createToken(user);
     }

     async forget(dto: AuthForgetDto) {
          const user = await this.prisma.user.findFirst({
               where: { email: dto.email },
          });

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

          return  { message: 'Password recovery email sent successfully' };
     }

}