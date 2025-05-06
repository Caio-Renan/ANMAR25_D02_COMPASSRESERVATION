import {
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Client } from '@prisma/client';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilterClientDto } from './dto/filter-client.dto';
import { getPaginationParams, buildPaginatedResponse } from '../common/utils/pagination.util';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { ClientValidationService } from './clientsValidate.service';

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
    private readonly validationService: ClientValidationService,
    private readonly emailService: EmailService, 
  ) { }

  async create(dto: CreateClientDto, userId: number): Promise<Client> {
    await this.validationService.validateClientFields(dto);

    const client = await this.prisma.client.create({
      data: {
        ...dto,
        user: { connect: { id: userId } },
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

    const validationUrl = `${process.env.APP_URL}/api/v1/verify-email?token=${token}`

    await this.emailService.sendEmailVerification(client.email, client.name, validationUrl)

    return client;

  }

  async update(id: number, dto: UpdateClientDto): Promise<Client> {

    await this.validationService.validateClientFields(dto);

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
    if (filter.cpf) where.cpf = { contains: filter.cpf };

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
    return this.validationService.getClientOrFail(id, clientSelect);
  }

  async softDelete(id: number) {
    const client = await this.validationService.getClientOrFail(id);

    await this.validationService.ensureClientIsActive(client);

    return this.prisma.client.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        updatedAt: new Date(),
      },
      select: clientSelect,
    });
  }

  async validateMail(id: number){

    await this.validationService.verifiedEmail(id);

    const client = await this.validationService.getClientOrFail(id);
    
    const token = this.jwtService.sign(
      { id: client.id },
      {
        expiresIn: '1h',
        subject: String(client.id),
        issuer: 'email-verification',
        audience: 'clients',
      }
    );
    console.log("Generated JWT Token:", token);

    const validationUrl = `${process.env.APP_URL}/api/v1/verify-email?token=${token}`

    await this.emailService.sendEmailVerification(client.email, client.name, validationUrl)
  }
}