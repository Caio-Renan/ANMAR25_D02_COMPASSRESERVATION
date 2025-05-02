import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { AuthLoginDto } from "./dto/auth-login.dto";
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {

     private issuer = 'login';
     private audience = 'users';

     constructor(
          private readonly prisma: PrismaService,
          private readonly jwtService: JwtService,
          private readonly userService: UsersService,
     ) { }

     private createToken(user: { id: number; name: string; email: string }) {
          return {
               accessToken: this.jwtService.sign(
                    {
                         id: user.id,
                         name: user.name,
                         email: user.email,
                    },
                    {
                         expiresIn: '2 days',
                         subject: String(user.id),
                         issuer: this.issuer,
                         audience: this.audience,
                    },
               ),
          };
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

          return this.createToken({
               id: user.id,
               name: user.name,
               email: user.email,
          });
     }

     async register(dto: AuthRegisterDto) {

          const user = await this.userService.create(dto);

          return this.createToken(user);
     }

}