import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const { name, cpf, email, phone, birthDate, status } = createClientDto;

    return this.prisma.client.create({
      data: {
        name,
        cpf,
        email,
        phone,
        birthDate,
        status,
      },
    });
  }
}
