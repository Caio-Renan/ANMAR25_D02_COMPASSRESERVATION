import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthForgetDto } from "./dto/auth-forget.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";


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

     // @Post('forget')
     // async forget(@Body() { email }: AuthForgetDto) {
     //      return this.authService.forget({ email });
     // }

     // @Post('reset')
     // async reset(@Body() { password, token }) {
     //      return this.authService.reset({ password, token });
     // }
}