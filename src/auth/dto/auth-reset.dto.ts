import { IsJWT, IsStrongPassword } from "class-validator";


export class AuthResetDto{

     @IsStrongPassword({
          minLength: 8,
     })
     password: string;

     @IsJWT()
     token: string;
     
}