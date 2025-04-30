import { Injectable } from '@nestjs/common';
import { Client } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

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

  async findAll(): Promise<Client[]> {
    return this.prisma.client.findMany();
  }

  async findOne(id: number): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }
}
