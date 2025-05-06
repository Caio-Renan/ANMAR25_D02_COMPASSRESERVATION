import { IsPersonName, IsCustomEmail, IsCustomPassword, IsFormattedPhoneNumber } from '../../common/decorators';
export class CreateUserDto {
    @IsPersonName()   
    name: string;
    
    @IsCustomEmail()
    email: string;
    
    @IsCustomPassword()
    password: string;

    @IsFormattedPhoneNumber()
    phone: string;
}