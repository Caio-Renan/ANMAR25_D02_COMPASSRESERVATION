import { Transform } from "class-transformer";
import { IsEmail, IsString, MaxLength } from "class-validator";


export class AuthForgetDto {

     @IsEmail()
     @IsString()
     @MaxLength(150)
     @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
     email: string;
}