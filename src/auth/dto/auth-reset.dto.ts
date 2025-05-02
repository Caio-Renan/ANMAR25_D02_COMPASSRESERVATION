import { IsJWT, IsStrongPassword } from "class-validator";



export class AuthResetDto {

     @IsJWT()
     token: string;
   
     @IsStrongPassword()
     password: string;
}
