import { IsJWT } from "class-validator";


export class AuthVerifyEmailDto {


     @IsJWT()
     token: string;
}