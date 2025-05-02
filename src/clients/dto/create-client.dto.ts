import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  IsEnum
} from 'class-validator';
import { Status } from '@prisma/client';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.replace(/\s+/g, ' ').trim();
    }
    return value;
  })
  @Matches(/^[A-Za-zÀ-ÿ\s.'-]+$/, {
    message: 'name must contain only letters, spaces, dots, apostrophes, or hyphens.'
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(11, 14)
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
  
    const digits = value.replace(/\D/g, '');
  
    if (digits.length !== 11) return value;
  
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'cpf must be in the format 000.000.000-00'
  })
  cpf: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    const digits = value.replace(/\D/g, '');
  
    let ddi = '';
    let ddd = '';
    let main = '';
  
    if (digits.length === 13 && digits.startsWith('55')) {
      ddi = '+55';
      ddd = digits.slice(2, 4);
      main = digits.slice(4);
    } else if (digits.length === 11) {
      ddi = '+55';
      ddd = digits.slice(0, 2);
      main = digits.slice(2);
    } else if (digits.length === 10) {
      ddi = '+55';
      ddd = digits.slice(0, 2);
      main = digits.slice(2);
    } else {
      return value;
    }
    const prefix = main.length === 9 ? main.slice(0, 5) : main.slice(0, 4);
    const suffix = main.length === 9 ? main.slice(5) : main.slice(4);
  
    return `${ddi} (${ddd}) ${prefix}-${suffix}`;
  })
  @IsPhoneNumber('BR', { message: 'phone must be a valid phone number (e.g., (xx) xxxx-xxxx, +55 (xx) xxxx-xxxx).'})
  phone: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
