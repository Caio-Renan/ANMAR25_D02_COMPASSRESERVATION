import { IsJWT, IsStrongPassword } from "class-validator";
import { CreateUserDTO } from "src/users/dto/create-user.dto";



export class AuthResetDto extends CreateUserDTO {

     @IsJWT()
     token: string;
   
}
