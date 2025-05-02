import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { AuthRegisterDto } from "./dto/auth-register.dto";



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


     async register(dto: AuthRegisterDto) {

          const user = await this.userService.create(dto);

          return this.createToken(user);
     }

}