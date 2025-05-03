import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateReservationDto,
  CreateReservationResourceDto,
} from './dto/create-reservation-dto';
import { ReservationValidationService } from './reservationsValidate.service';
import { Prisma, Reservation } from '@prisma/client';
import { UpdateReservationDto } from './dto/update-reservation-dto';
import ical from 'ical-generator';
import { EmailService } from 'src/email/email.service';

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
    if (!resources || !Array.isArray(resources.create)) {
      throw new NotAcceptableException('Invalid resources format');
    }

    const isSpaceActive = await this.validationService.isSpaceActive(spaceId);

    if (!isSpaceActive) {
      throw new NotFoundException('Space not found or is inactive');
    }

    const resourceArray = resources.create;

    await this.validationService.isResourceActiveAndEnough(resourceArray);

    await this.validationService.isDateAvailable(spaceId, startDate, endDate);

    await this.validationService.verifyClient(clientId);

    await this.validationService.updateQuantity(resourceArray);

    return this.prisma.reservation.create({
      data: {
        clientId,
        spaceId,
        startDate,
        endDate,
        status: 'OPEN',
        resources: {
          create: resourceArray,
        },
      },
    });
  }

  async findAll(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany();
  }

  async findOne(id: number): Promise<Reservation | null> {
    await this.exists(id);
    return this.prisma.reservation.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateReservationDto) {
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
      })

      if(client) {
        await this.emailService.sendReservationApprovalEmail(
          client.email,
          client.name,
          reservation.startDate,
          reservation.endDate,
          `Space ${reservation.spaceId}`
        )
      }

    }

    if (data.status === 'CLOSED') {
      if (reservation.status !== 'APPROVED') {
        throw new BadRequestException(
          'It is only possible to close reservations with "approved" status',
        );
      }
    }

    const newData: Prisma.ReservationUpdateInput = {
      startDate: data.startDate,
      endDate: data.endDate,
    };

    newData.closedAt = new Date();

    return this.prisma.reservation.update({ where: { id }, data: newData });
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
