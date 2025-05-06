import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReservationDto,
  CreateReservationResourceDto,
} from './dto/create-reservation-dto';
import { ReservationValidationService } from './reservationsValidate.service';
import { Prisma, Reservation, ReservationStatus } from '@prisma/client';
import { UpdateReservationDto } from './dto/update-reservation-dto';
import ical from 'ical-generator';
import { EmailService } from '../email/email.service';
import { FilterReservationDto } from './dto/filter-reservation.dto';
import {
  getPaginationParams,
  buildPaginatedResponse,
} from '../common/utils/pagination.util';

const getSelectFields = () => ({
  client: {
    select: {
      name: true,
      cpf: true,
      email: true,
      phone: true,
    },
  },
  space: {
    select: {
      name: true,
    },
  },
  resources: {
    select: {
      quantity: true,
      resource: {
        select: {
          name: true,
        },
      },
    },
  },
});

@Injectable()
export class ReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: ReservationValidationService,
    private readonly emailService: EmailService,
  ) {}

  async create({
    spaceId,
    clientId,
    endDate,
    startDate,
    resources,
  }: CreateReservationDto) {
    if (!resources || !Array.isArray(resources)) {
      throw new NotAcceptableException('Invalid resources format');
    }

    const isSpaceActive = await this.validationService.isSpaceActive(spaceId);
    if (!isSpaceActive) {
      throw new NotFoundException('Space not found or is inactive');
    }

    await this.validationService.isResourceActiveAndEnough(resources);
    await this.validationService.isDateAvailable(spaceId, startDate, endDate);
    await this.validationService.verifyClient(clientId);
    await this.validationService.updateQuantity(resources);

    const reservation = await this.prisma.reservation.create({
      data: {
        clientId,
        spaceId,
        startDate,
        endDate,
        status: 'OPEN',
        resources: {
          create: resources,
        },
      },
      include: getSelectFields(),
    });

    return {
      ...reservation,
      resources: reservation.resources.map((r) => ({
        resource: r.resource.name,
        quantity: r.quantity,
      })),
    };
  }

  async findAll(filter: FilterReservationDto) {
    const page = parseInt(filter.page?.toString() || '1', 10);
    const limit = parseInt(filter.limit?.toString() || '10', 10);

    const { skip, take } = getPaginationParams({ page, limit });

    const where: Prisma.ReservationWhereInput = {};

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.cpf || filter.name || filter.phone) {
      where.client = {};

      if (filter.cpf) {
        where.client.cpf = filter.cpf;
      }

      if (filter.name) {
        where.client.name = {
          contains: filter.name,
        };
      }

      if (filter.phone) {
        where.client.phone = {
          contains: filter.phone,
        };
      }
    }

    if (filter.spaceName) {
      where.space = {
        name: {
          contains: filter.spaceName,
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        skip,
        take,
        include: getSelectFields(),
      }),
      this.prisma.reservation.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: number): Promise<Reservation | null> {
    await this.exists(id);
    return this.prisma.reservation.findUnique({
      where: { id },
      include: getSelectFields(),
    });
  }

  async updatePartial(id: number, data: UpdateReservationDto) {
    const reservation = await this.findOne(id);

    if (!reservation) {
      throw new NotFoundException('reservation not found');
    }

    if (data.status == 'CANCELED') {
      throw new BadRequestException(
        'Changing status to canceled when editing is not allowed',
      );
    }

    if (data.status === 'APPROVED') {
      if (reservation.status != 'OPEN') {
        throw new BadRequestException(
          'Only reservations with "open" status can be approved',
        );
      }

      const client = await this.prisma.client.findUnique({
        where: { id: reservation.clientId },
      });

      if (client) {
        await this.emailService.sendReservationApprovalEmail(
          client.email,
          client.name,
          reservation.startDate,
          reservation.endDate,
          `Space ${reservation.spaceId}`,
        );
      }
    }

    if (data.status === 'CLOSED') {
      if (reservation.status !== 'APPROVED') {
        throw new BadRequestException(
          'It is only possible to close reservations with "approved" status',
        );
      }
    }

    if (data.startDate || data.endDate) {
      if (reservation.status === 'CLOSED') {
        throw new BadRequestException(
          'Date fields cannot be updated after booking is in cancelled status',
        );
      }

      await this.validationService.isDateAvailable(
        reservation.spaceId,
        data.startDate || reservation.startDate,
        data.endDate || reservation.endDate,
      );
    }

    const newData: Prisma.ReservationUpdateInput = {
      status: data.status as ReservationStatus,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    return this.prisma.reservation.update({
      where: { id },
      data: newData,
      include: getSelectFields(),
    });
  }

  async softDelete(id: number) {
    const reservation = await this.findOne(id);

    if (!reservation) {
      throw new NotFoundException('reservation not found');
    }

    if (reservation?.status !== 'OPEN') {
      throw new BadRequestException(
        'It is only possible to cancel reservations with "open" status',
      );
    }

    const newData = { ...reservation };
    newData.status = 'CANCELED';
    newData.updatedAt = new Date();

    await this.prisma.reservation.update({ where: { id }, data: newData });
  }

  async exists(id: number) {
    if (!(await this.prisma.reservation.count({ where: { id } }))) {
      throw new NotFoundException('reservation not found');
    }
  }
}
