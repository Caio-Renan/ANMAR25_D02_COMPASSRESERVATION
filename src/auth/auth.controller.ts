import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthForgetDto } from "./dto/auth-forget.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";


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

     // @Post('forget')
     // async forget(@Body() { email }: AuthForgetDto) {
     //      return this.authService.forget({ email });
     // }

     // @Post('reset')
     // async reset(@Body() { password, token }) {
     //      return this.authService.reset({ password, token });
     // }
}