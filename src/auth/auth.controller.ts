import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthForgetDto } from "./dto/auth-forget.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { AuthResetDto } from "./dto/auth-reset.dto";
import { AuthVerifyEmailDto } from "./dto/auth-verify-email.dto";


@Controller()
export class AuthController {
     constructor(
          private readonly authService: AuthService
     ) { }

     @Post('login')
     async login(@Body() dto: AuthLoginDto) {
          return this.authService.login(dto);
     }

     @Post('register')
     async register(@Body() dto: AuthRegisterDto) {
          return this.authService.register(dto);
     }

     @Get('me')
     async getProfile(@CurrentUser() user: any) {
          return user;
     }

     @Post('forget')
     async forget(@Body() dto: AuthForgetDto) {
          return this.authService.forget(dto);
     }

     @Post('reset')
     async reset(@Body() dto: AuthResetDto) {
          return this.authService.reset(dto);
     }

     @Get('verify-email')
     async verifyEmail(@Query('token') dto: AuthVerifyEmailDto){
          return this.authService.verifyEmail(dto);
     }
}