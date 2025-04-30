import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsInt, IsNotEmpty, IsPhoneNumber, IsString, Length, IsEnum, IsOptional } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(11, 14)
  cpf: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;
  
  @IsEnum(Status) 
  @IsOptional() 
  status?: Status;
}

