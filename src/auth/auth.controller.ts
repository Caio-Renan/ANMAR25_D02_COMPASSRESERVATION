import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";



@Controller()
export class AuthController{

     constructor(
          private readonly authService: AuthService
     ) {}


     @Post('login')
     async login(@Body() email: string, password: string){
          return { email, password };
     }

     @Post('register')
     async register(@Body() body){
          return { body }
     }


}