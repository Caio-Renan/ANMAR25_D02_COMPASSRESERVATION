import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation-dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReservationDto) {
     const transformedData = {
          ...data,
          resources: {
            create: data.resources.map(resource => ({
              resourceId: resource.resourceId,
              quantity: resource.quantity,
            })),
          },
        };
      
        return this.prisma.reservation.create({ data: transformedData });
  }
}
