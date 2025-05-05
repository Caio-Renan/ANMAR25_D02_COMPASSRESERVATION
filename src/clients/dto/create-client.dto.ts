import { IsPersonName, IsCustomEmail, IsCpf, IsFormattedPhoneNumber, IsGenericDate } from 'src/common/decorators';
export class CreateClientDto {
  @IsPersonName()
  name: string;

  @IsCpf()
  cpf: string;

  @IsCustomEmail()
  email: string;

  @IsFormattedPhoneNumber()
  phone: string;

  @IsGenericDate()
  birthDate: Date;
}
