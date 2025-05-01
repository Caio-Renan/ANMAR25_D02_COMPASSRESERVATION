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
     async login(@Body() { email, password }: AuthLoginDto) {
          return { email, password };
     }

     @Post('register')
     async register(@Body() body: AuthRegisterDto) {
          return { body }
     }

     @Post('forget')
     async forget(@Body() { email }: AuthForgetDto) {
          return { email }
     }

     @Post('reset')
     async reset(@Body() { password, token }) {
          return { password, token }
     }

}