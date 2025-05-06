import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { config as loadEnv } from 'dotenv';
import { validateEnv } from '../src/common/config/env/validate-env';
import { logger } from '../src/common/config/logger';
import { prisma } from '../src/common/config/prisma';

loadEnv();

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

    logger.info('Default user created');
  } else {
    logger.info('Default user already exists.');
  }

    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: env.DEFAULT_ADMIN_EMAIL,
      },
    });
  
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(env.DEFAULT_ADMIN_PASSWORD, 10);
  
      await prisma.user.create({
        data: {
          name: env.DEFAULT_ADMIN_NAME,
          email: env.DEFAULT_ADMIN_EMAIL,
          password: hashedPassword,
          phone: env.DEFAULT_ADMIN_PHONE,
          status: 'ACTIVE',
          role: 'ADMIN', 
        },
      });
  
      logger.info('Admin created');
    } else {
      logger.info('Admin already exists.');
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