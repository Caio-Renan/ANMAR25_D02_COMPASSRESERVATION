import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { EmailModule } from "src/email/email.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRATION') || '1d' },
      }),
    }),
    PrismaModule,
    forwardRef(() => UsersModule),
    EmailModule,
  ],
  providers: [AuthService, JwtStrategy,],
  exports: [AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
