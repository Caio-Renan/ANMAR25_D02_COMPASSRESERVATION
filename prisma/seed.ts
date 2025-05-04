import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import pino from 'pino';
import { config as loadEnv } from 'dotenv';
import { validateEnv } from '../src/common/config/env/validate-env';

loadEnv();

const isDev = process.env.NODE_ENV !== 'production';
const prisma = new PrismaClient();
const logger = pino({
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      }
    : undefined,
});

async function main() {
  const env = validateEnv(process.env);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: env.DEFAULT_USER_EMAIL },
        { phone: env.DEFAULT_USER_PHONE }
      ]
    },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(env.DEFAULT_USER_PASSWORD, 10);

    await prisma.user.create({
      data: {
        name: env.DEFAULT_USER_NAME,
        email: env.DEFAULT_USER_EMAIL,
        password: hashedPassword,
        phone: env.DEFAULT_USER_PHONE,
        status: 'ACTIVE',
      },
    });

    logger.info('default user created');
  } else {
    logger.info('default user already exists.');
  }
}

main()
  .catch((e) => {
    logger.error(`Seed failed:\n${e instanceof Error ? e.message : JSON.stringify(e)}`); 
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });