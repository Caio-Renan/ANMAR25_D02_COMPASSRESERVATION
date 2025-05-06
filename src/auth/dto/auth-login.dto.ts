import { IsCustomEmail, IsCustomPassword } from "src/common/decorators";

export class AuthLoginDto {
     @IsCustomEmail()
     email: string;

     @IsCustomPassword()
     password: string;
}