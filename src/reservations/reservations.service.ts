import {
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
import { Reservation } from '@prisma/client';
import { UpdateReservationDto } from './dto/update-reservation-dto';

@Injectable()
export class ReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: ReservationValidationService,
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
    await this.exists(id);
    return this.prisma.reservation.update({ data, where: { id } });
  }

  async delete(id: number) {
    await this.exists(id);
    return this.prisma.reservation.delete({ where: { id } });
  }

  async exists(id: number) {
    if (!(await this.prisma.reservation.count({ where: { id } }))) {
      throw new NotFoundException('reservation not found');
    }
  }
}
