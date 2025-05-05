import { IsPersonName, IsCustomEmail, IsCustomPassword, IsFormattedPhoneNumber } from 'src/common/decorators';
export class CreateUserDTO {
    @IsPersonName()   
    name: string;
    
    @IsCustomEmail()
    email: string;
    
    @IsCustomPassword()
    password: string;

    @IsFormattedPhoneNumber()
    phone: string;
}