import { IsString, IsOptional, IsEnum, IsNotEmpty, MaxLength, Matches, Length, IsPhoneNumber } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto'
import { Transform } from 'class-transformer';

export class FilterReservationDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Matches(/^[A-Za-zÀ-ÿ\s.'-]+$/, { message: 'name must contain only letters, spaces, dots, apostrophes, or hyphens.' })
  name?: string;
  
  @IsOptional()
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
  cpf?: string;

  @IsOptional()
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
    @IsPhoneNumber('BR', {
      message: 'phone must be a valid phone number (e.g., +55 (xx) xxxxx-xxxx)'
    })
  phone?: string;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  spaceName?: string;

}