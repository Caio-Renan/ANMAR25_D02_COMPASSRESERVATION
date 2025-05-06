import { IsCustomEmail } from "src/common/decorators";
export class AuthForgetDto {
     @IsCustomEmail()
     email: string;
}