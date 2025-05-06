import { IsJWT } from "class-validator";
import { IsCustomPassword } from "src/common/decorators";
export class AuthResetDto {
     @IsJWT()
     token: string;

     @IsCustomPassword()
     password: string;
}
