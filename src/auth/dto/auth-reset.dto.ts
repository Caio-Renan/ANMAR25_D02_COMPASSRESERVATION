import { Transform } from "class-transformer";
import { IsJWT, IsNotEmpty, IsStrongPassword, Length, Matches } from "class-validator";
import { CreateUserDTO } from "src/users/dto/create-user.dto";



export class AuthResetDto {

     @IsJWT()
     token: string;

     @IsNotEmpty()
     @Length(8, 64)
     @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
     @Matches(/^\S*$/, { message: 'Password should not contain spaces.' })
     @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/, { message: 'password must contain letters and numbers.' })
     password: string;

}
