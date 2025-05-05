import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length, Matches, MaxLength } from "class-validator";

export class AuthLoginDto {

     @IsEmail()
     @IsString()
     @MaxLength(150)
     @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
     email: string;

     @IsNotEmpty()
     @Length(8, 64)
     @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
     @Matches(/^\S*$/, { message: 'Password should not contain spaces.' })
     @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/, { message: 'password must contain letters and numbers.' })
     password: string;

}