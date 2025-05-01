import { IsEmail, IsNotEmpty, Matches, Length, MaxLength, IsString, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDTO {
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
    
    @IsEmail()
    @IsString()
    @MaxLength(150)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    email: string;
    
    @IsNotEmpty()
    @Length(8, 64)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @Matches(/^\S*$/, { message: 'Password should not contain spaces.' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/, { message: 'password must contain letters and numbers.' })
    password: string;

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
}