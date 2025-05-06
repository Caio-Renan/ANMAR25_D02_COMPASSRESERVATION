import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException
  } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Space } from '@prisma/client';

@Injectable()
export class SpaceValidationService {
    constructor(private readonly prisma: PrismaService) {}
    async validateSpaceFields(dto: UpdateSpaceDto) {
        if (dto.name) {
          const nameExists = await this.prisma.space.findUnique({ where: { name: dto.name } });
          if (nameExists) throw new ConflictException('Space already registered');
        }
      }
    
     async getSpaceOrFail(id: number): Promise<Space> {
        const space = await this.prisma.space.findUnique({ where: { id } });
    
        if (!space) throw new NotFoundException('Space not found');
    
        return space;
      }
      
      async ensureSpaceIsActive(space: Space) {
        if (space.status === 'INACTIVE') {
          throw new BadRequestException('Space is already inactive');
        }
      }
      
      async validateNoBookings(prisma: PrismaService, id: number) {
        const bookings = await prisma.reservation.findMany({
          where: { spaceId: id },
        });
      
        if (bookings.length > 0) {
          throw new ConflictException('Cannot delete space with existing bookings');
        }
      }
}