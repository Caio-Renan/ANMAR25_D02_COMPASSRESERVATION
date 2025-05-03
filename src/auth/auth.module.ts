import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { EmailModule } from "src/email/email.module";


@Module({
     imports: [
          JwtModule.register({
               global: true,
               secret: process.env.JWT_SECRET,
               signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1d' }
          }),
          PrismaModule,
          forwardRef(() => UsersModule),
          EmailModule,
     ],
     providers: [AuthService],
     exports: [AuthService],
     controllers: [AuthController],
})
export class AuthModule {

}