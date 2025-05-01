import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";


@Module({
     imports: [JwtModule.register({
          secret: process.env.JWT_SECRET,
     }),
     PrismaModule
],
     providers: [AuthService],
     exports: [AuthService],
     controllers: [AuthController],
})
export class AuthModule{
     
}