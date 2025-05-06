import { IsEnum, Matches, IsBooleanString, IsEmail, IsNotEmpty, ValidateIf, IsUrl, IsNumberString, IsString } from 'class-validator';
import { Environment } from './env.enum';

export class EnvironmentDto {
  @IsEnum(Environment, { message: 'NODE_ENV must be one of: development, production, test' })
  NODE_ENV: Environment;

  @Matches(/^file:\.\//, {
    message: 'DATABASE_URL must start with "file:./" and point to a valid SQLite database file.',
  })
  DATABASE_URL: string;

  @IsUrl({require_tld: false}, { message: 'APP_URL must be a valid URL (e.g., http://localhost:3000 or https://meuapp.com)' })
  APP_URL: string;

  @IsEmail({}, { message: 'MAIL_USER must be a valid email address' })
  MAIL_USER: string;
  
  @IsNotEmpty({ message: 'MAIL_PASS is required' })
  MAIL_PASS: string;

  @IsNumberString()
  PORT: string;

  @IsString({ message: 'JWT_SECRET must be a string' })
  JWT_SECRET: string;

  @Matches(/^\d+$|^\d+[smhd]$/, { message:'JWT_EXPIRATION must be a number (e.g., 3600) or a string with time unit (e.g., 15m, 10h, 1d, 30s)' })
  JWT_EXPIRATION: string;
}