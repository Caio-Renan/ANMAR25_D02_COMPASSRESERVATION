import { IsCustomEmail } from 'src/common/decorators';

export class verifyClientMailDto   {

    @IsCustomEmail()
    email: string
}
