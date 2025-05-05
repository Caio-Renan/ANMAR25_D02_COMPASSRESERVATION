import { IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';
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

  @IsOptional()
  @IsEnum(Status)
  status?: Status; //Tem que tirar, acho
}
