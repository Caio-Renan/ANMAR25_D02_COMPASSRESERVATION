import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './common/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { LoggingInterceptor } from './interceptors/logging.inteceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  app.enableCors();

  // app.useGlobalGuards(new AuthGuard(new JwtService())); // Deixei comentado por que isso ativa a proteção global de todas as rotas

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
