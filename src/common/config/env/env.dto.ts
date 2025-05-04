import { IsEnum, Matches, IsBooleanString, IsEmail, IsNotEmpty, ValidateIf, IsUrl, IsNumberString } from 'class-validator';
import { Environment } from './env.enum';

export class EnvironmentDTO {
  @IsEnum(Environment, { message: 'NODE_ENV must be one of: development, production, test' })
  NODE_ENV: Environment;

  @Matches(/^file:\.\//, {
    message: 'DATABASE_URL must start with "file:./" and point to a valid SQLite database file.',
  })
  DATABASE_URL: string;

  @IsUrl({require_tld: false}, { message: 'APP_URL must be a valid URL (e.g., http://localhost:3000 or https://meuapp.com)' })
  APP_URL: string;

  @IsBooleanString({ message: 'EMAIL_ENABLED must be "true" or "false"' })
  EMAIL_ENABLED: string;

  @ValidateIf(o => o.EMAIL_ENABLED === "true")
  @IsEmail({}, { message: 'MAIL_USER must be a valid email address' })
  MAIL_USER?: string;

  @ValidateIf(o => o.EMAIL_ENABLED === "true")
  @IsNotEmpty({ message: 'MAIL_PASS is required' })
  MAIL_PASS?: string;

  @IsNumberString()
  PORT: string;
}