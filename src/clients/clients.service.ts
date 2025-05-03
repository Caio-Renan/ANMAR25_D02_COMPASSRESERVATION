import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Client } from '@prisma/client';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilterClientDto } from './dto/filter-client.dto';
import { getPaginationParams, buildPaginatedResponse } from '../common/utils/pagination.util';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';

const clientSelect: Prisma.ClientSelect = {
  id: true,
  name: true,
  cpf: true,
  email: true,
  phone: true,
  birthDate: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) { }

  async create(dto: CreateClientDto): Promise<Client> {
    const existingCpf = await this.prisma.client.findUnique({ where: { cpf: dto.cpf } });
    if (existingCpf) throw new ConflictException('CPF already registered');

    const existingEmail = await this.prisma.client.findUnique({ where: { email: dto.email } });
    if (existingEmail) throw new ConflictException('Email already registered');

    const existingPhone = await this.prisma.client.findUnique({ where: { phone: dto.phone } });
    if (existingPhone) throw new ConflictException('Phone already registered');

    const client = await this.prisma.client.create({
      data: {
        ...dto,
        status: 'ACTIVE',
      },
      select: clientSelect,
    });


    const token = this.jwtService.sign(
      { id: client.id },
      {
        expiresIn: '1h',
        subject: String(client.id),
        issuer: 'email-verification',
        audience: 'clients',
      }
    );


    const validationUrl = `${process.env.APP_URL}/auth/verify-email??token=${token}`

    await this.emailService.sendEmailVerification(client.email, client.name, validationUrl)


    return client;



  }

  async update(id: number, dto: UpdateClientDto): Promise<Client> {
    await this.isIdValueCorrect(id);
    const client = await this.checkIfClientExists(id);

    if (dto.email && dto.email !== client.email) {
      const emailExists = await this.prisma.client.findUnique({ where: { email: dto.email } });
      if (emailExists) throw new ConflictException('Email already registered');
    }

    if (dto.phone && dto.phone !== client.phone) {
      const phoneExists = await this.prisma.client.findUnique({ where: { phone: dto.phone } });
      if (phoneExists) throw new ConflictException('Phone already registered');
    }

    if (dto.cpf && dto.cpf !== client.cpf) {
      const cpfExists = await this.prisma.client.findUnique({ where: { cpf: dto.cpf } });
      if (cpfExists) throw new ConflictException('CPF already registered');
    }

    return this.prisma.client.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
      select: clientSelect,
    });
  }

  async findAll(filter: FilterClientDto) {
    const page = parseInt(filter.page?.toString() || '1', 10);
    const limit = parseInt(filter.limit?.toString() || '10', 10);
    const { skip, take } = getPaginationParams({ page, limit });

    const where: Prisma.ClientWhereInput = {};

    if (filter.name) where.name = { contains: filter.name };
    if (filter.email) where.email = { contains: filter.email };
    if (filter.status) where.status = filter.status;

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take,
        select: clientSelect,
      }),
      this.prisma.client.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findById(id: number) {
    await this.isIdValueCorrect(id);
    return this.checkIfClientExists(id, clientSelect);
  }

  async softDelete(id: number) {
    await this.isIdValueCorrect(id);
    const client = await this.checkIfClientExists(id);

    if (client.status === 'INACTIVE') {
      throw new ConflictException('Client already INACTIVE');
    }

    return this.prisma.client.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        updatedAt: new Date(),
      },
      select: clientSelect,
    });
  }

  async isIdValueCorrect(id: number) {
    if (Number.isNaN(id)) throw new BadRequestException('ID must be a number');
    if (id < 1) throw new BadRequestException('ID must be at least 1');
  }

  async checkIfClientExists(id: number, select?: Prisma.ClientSelect): Promise<Client> {
    const client = await this.prisma.client.findUnique({ where: { id }, select });

    if (!client) throw new NotFoundException('Client not found');

    return client;
  }
}
