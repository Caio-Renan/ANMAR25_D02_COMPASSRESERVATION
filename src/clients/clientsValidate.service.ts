import {
    Injectable,
    NotFoundException,
    ConflictException,
  } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { Prisma, Client } from '@prisma/client';

@Injectable()
export class ClientValidationService {
    constructor(private readonly prisma: PrismaService) {}
    async validateClientFields(dto: UpdateClientDto) {
        if (dto.email) {
          const emailExists = await this.prisma.client.findUnique({ where: { email: dto.email } });
          if (emailExists) throw new ConflictException('Email already registered');
        }
    
        if (dto.phone) {
          const phoneExists = await this.prisma.client.findUnique({ where: { phone: dto.phone } });
          if (phoneExists) throw new ConflictException('Phone already registered');
        }
    
        if (dto.cpf) {
          const cpfExists = await this.prisma.client.findUnique({ where: { cpf: dto.cpf } });
          if (cpfExists) throw new ConflictException('CPF already registered');
        }
      }
    
     async getClientOrFail(id: number, select?: Prisma.ClientSelect): Promise<Client> {
        const client = await this.prisma.client.findUnique({ where: { id }, select });
    
        if (!client) throw new NotFoundException('Client not found');
    
        return client;
      }
}