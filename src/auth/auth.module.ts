import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";


@Module({
     imports: [JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' }
     }),
     PrismaModule
],
     providers: [AuthService],
     exports: [AuthService],
     controllers: [AuthController],
})
export class AuthModule{

}