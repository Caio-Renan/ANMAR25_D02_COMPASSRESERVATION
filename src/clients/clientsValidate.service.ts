import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException
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

        if (client.status !== 'ACTIVE') {
          throw new BadRequestException('Client inactive');
        }
    
        return client;
      }

      async ensureClientIsActive(client: Client) {
        if (client.status === 'INACTIVE') {
          throw new BadRequestException('Client is already inactive');
        }
      }

      async verifiedEmail(id: number){
       const client = await this.getClientOrFail(id)
       const email = client.isEmailVerified;
       if(email){
        throw new BadRequestException('Email is already verified')
       }

      }
      
}