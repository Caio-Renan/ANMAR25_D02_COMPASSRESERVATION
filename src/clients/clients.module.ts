import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/auth/auth.module';
import { ClientValidationService } from './clientsValidate.service';

@Module({
  imports: [PrismaModule, EmailModule, AuthModule],
  controllers: [ClientsController],
  providers: [ClientsService, ClientValidationService,PrismaService],
})
export class ClientsModule {}
