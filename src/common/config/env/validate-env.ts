import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentDto } from './env.dto';
import { requiredEnvVars } from './required-env-vars';
import { Environment } from './env.enum';
import { CreateUserDto } from '../../../users/dto/create-user.dto';

export type ValidatedEnv = {
  NODE_ENV: Environment;
  DATABASE_URL: string;
  APP_URL: string;

  MAIL_USER?: string;
  MAIL_PASS?: string;
  DEFAULT_USER_NAME: string;
  DEFAULT_USER_EMAIL: string;
  DEFAULT_USER_PASSWORD: string;
  DEFAULT_USER_PHONE: string;
  DEFAULT_ADMIN_NAME: string;
  DEFAULT_ADMIN_EMAIL: string;
  DEFAULT_ADMIN_PASSWORD: string;
  DEFAULT_ADMIN_PHONE: string;
  PORT: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
};

export function validateEnv(config: Record<string, unknown>): ValidatedEnv {
  const errors: string[] = [];

  const missingVars = requiredEnvVars.filter(key => config[key] === undefined || config[key] === '');

  if (missingVars.length > 0) {
    throw new Error(
      'Missing required environment variables:\n' +
      missingVars.map(variable => `- ${variable}`).join('\n')
    );
  }

  const envConfig = plainToInstance(EnvironmentDto, config, {
    enableImplicitConversion: true,
  });

  const envErrors = validateSync(envConfig, { skipMissingProperties: false });

  if (envErrors.length > 0) {
    const envMessages = envErrors
      .flatMap(err => Object.values(err.constraints ?? {}))
      .map(msg => `- ${msg}`);
    errors.push('Environment variable errors:\n' + envMessages.join('\n'));
  }

  const userDto = plainToInstance(CreateUserDto, {
    name: config.DEFAULT_USER_NAME,
    email: config.DEFAULT_USER_EMAIL,
    password: config.DEFAULT_USER_PASSWORD,
    phone: config.DEFAULT_USER_PHONE,
  });

  const adminDto = plainToInstance(CreateUserDto, {
    name: config.DEFAULT_ADMIN_NAME,
    email: config.DEFAULT_ADMIN_EMAIL,
    password: config.DEFAULT_ADMIN_PASSWORD,
    phone: config.DEFAULT_ADMIN_PHONE,
  });

  const adminErrors = validateSync(adminDto, { skipMissingProperties: false });

  if (adminErrors.length > 0) {
    const adminMessages = adminErrors
      .flatMap(err => Object.values(err.constraints ?? {}))
      .map(msg => `- ${msg}`);
    errors.push('Default admin configuration errors:\n' + adminMessages.join('\n'));
  }

  const userErrors = validateSync(userDto, { skipMissingProperties: false });

  if (userErrors.length > 0) {
    const userMessages = userErrors
      .flatMap(err => Object.values(err.constraints ?? {}))
      .map(msg => `- ${msg}`);
    errors.push('Default user configuration errors:\n' + userMessages.join('\n'));
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n\n'));
  }

  return {
    NODE_ENV: envConfig.NODE_ENV,
    DATABASE_URL: envConfig.DATABASE_URL,
    APP_URL: envConfig.APP_URL,
    MAIL_USER: envConfig.MAIL_USER,
    MAIL_PASS: envConfig.MAIL_PASS,
    PORT: envConfig.PORT,
    JWT_SECRET: envConfig.JWT_SECRET,
    JWT_EXPIRATION: envConfig.JWT_EXPIRATION,
    DEFAULT_USER_NAME: userDto.name,
    DEFAULT_USER_EMAIL: userDto.email,
    DEFAULT_USER_PASSWORD: userDto.password,
    DEFAULT_USER_PHONE: userDto.phone,
    DEFAULT_ADMIN_NAME: adminDto.name,
    DEFAULT_ADMIN_EMAIL: adminDto.email,
    DEFAULT_ADMIN_PASSWORD: adminDto.password,
    DEFAULT_ADMIN_PHONE: adminDto.phone,
  };
}