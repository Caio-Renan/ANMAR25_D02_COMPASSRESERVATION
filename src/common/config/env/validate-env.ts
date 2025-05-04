import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentDTO } from './env.dto';
import { requiredEnvVars } from './required-env-vars';
import { Environment } from './env.enum';
import { CreateUserDTO } from '../../../users/dto/create-user.dto';

export type ValidatedEnv = {
  NODE_ENV: Environment;
  DATABASE_URL: string;
  APP_URL: string;
  EMAIL_ENABLED: string;
  MAIL_USER?: string;
  MAIL_PASS?: string;
  DEFAULT_USER_NAME: string;
  DEFAULT_USER_EMAIL: string;
  DEFAULT_USER_PASSWORD: string;
  DEFAULT_USER_PHONE: string;
  PORT: string;
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

  const envConfig = plainToInstance(EnvironmentDTO, config, {
    enableImplicitConversion: true,
  });

  const envErrors = validateSync(envConfig, { skipMissingProperties: false });

  if (envErrors.length > 0) {
    const envMessages = envErrors
      .flatMap(err => Object.values(err.constraints ?? {}))
      .map(msg => `- ${msg}`);
    errors.push('Environment variable errors:\n' + envMessages.join('\n'));
  }

  const userDTO = plainToInstance(CreateUserDTO, {
    name: config.DEFAULT_USER_NAME,
    email: config.DEFAULT_USER_EMAIL,
    password: config.DEFAULT_USER_PASSWORD,
    phone: config.DEFAULT_USER_PHONE,
  });

  const userErrors = validateSync(userDTO, { skipMissingProperties: false });

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
    EMAIL_ENABLED: envConfig.EMAIL_ENABLED,
    MAIL_USER: envConfig.MAIL_USER,
    MAIL_PASS: envConfig.MAIL_PASS,
    PORT: envConfig.PORT,
    DEFAULT_USER_NAME: userDTO.name,
    DEFAULT_USER_EMAIL: userDTO.email,
    DEFAULT_USER_PASSWORD: userDTO.password,
    DEFAULT_USER_PHONE: userDTO.phone,
  };
}