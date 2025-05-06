import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationResourceDto } from './dto/create-reservation-dto';

@Injectable()
export class ReservationValidationService {
  constructor(private readonly prisma: PrismaService) {}

  async isSpaceActive(spaceId: number): Promise<boolean> {
    const space = await this.prisma.space.findUnique({
      where: { id: spaceId },
      select: { status: true },
    });

    return space?.status === 'ACTIVE';
  }

  async isResourceActiveAndEnough(
    resources: CreateReservationResourceDto[],
  ): Promise<boolean> {

    for (const { resourceId, quantity } of resources) {

      const resource = await this.prisma.resource.findUnique({
        where: { id: resourceId },
      });

      if (!resource || resource.status === 'INACTIVE') {
        throw new NotFoundException(
          `Resource with ID ${resourceId} not found or is inactive`,
        );
      }

      if (quantity > resource.quantity) {
        throw new NotAcceptableException(
          `Not enough of resource ${resourceId}. Requested: ${quantity}, Available: ${resource.quantity}`,
        );
      }
    }
    return true;
  }

  async isDateAvailable(
    spaceId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    if (endDate < startDate) {
      throw new BadRequestException(
        'End date cannot be earlier than start date',
      );
    }

    const conflictingReservations = await this.prisma.reservation.findFirst({
      where: {
        spaceId,
        AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
      },
    });

    if (conflictingReservations) {
      throw new ConflictException('Date is not available');
    }

    return true;
  }

  async verifyClient(clientId: number) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (client.status === 'INACTIVE') {
      throw new BadRequestException('Client is inactive');
    }
  }

  async updateQuantity(resources: CreateReservationResourceDto[]) {
    await Promise.all(
      resources.map(({ resourceId, quantity }) => {
        this.prisma.resource.update({
          where: { id: resourceId },
          data: { quantity: { decrement: quantity } },
        });
      }),
    );
  }
}
