import { IsPersonName, IsCustomEmail, IsCustomPassword, IsFormattedPhoneNumber } from '../../common/decorators';
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