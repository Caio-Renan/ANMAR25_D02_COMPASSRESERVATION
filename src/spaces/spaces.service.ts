import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateSpaceDto } from './dto/update-space.dto'; 
import type { CreateSpaceDto } from './dto/create-space.dto';  
import { PrismaService } from 'src/prisma/prisma.service';
import { Space } from '@prisma/client';

@Injectable()
export class SpacesService {
  count(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  async create(createSpaceDto: CreateSpaceDto): Promise<Space> {
    const { name, description, capacity } = createSpaceDto;

    const existingSpace = await this.prisma.space.findUnique({
      where: { name },
    });

    if (existingSpace) {
      throw new ConflictException('Space with this name already exists');
    }

    return this.prisma.space.create({
      data: {
        name,
        description,
        capacity,
      },
    });
  }

  async findAll(skip: number, take: number): Promise<Space[]> {
    return this.prisma.space.findMany({
      skip,
      take,
    });
  }

  async findOne(id: number): Promise<Space | null> {
    return this.prisma.space.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateSpaceDto: UpdateSpaceDto): Promise<Space> {
    return this.prisma.space.update({
      where: { id },
      data: updateSpaceDto,
    });
  }

  async remove(id: number): Promise<void> {
    const existingSpace = await this.prisma.space.findUnique({
      where: { id },
    });

    if (!existingSpace) {
      throw new NotFoundException(`Space with id ${id} not found`);
    }

    const bookings = await this.prisma.reservation.findMany({
      where: { spaceId: id },
    });

    if (bookings.length > 0) {
      throw new ConflictException('Cannot delete space with existing bookings');
    }

    await this.prisma.space.delete({
      where: { id },
    });
  }
}
