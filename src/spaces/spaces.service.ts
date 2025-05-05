import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateSpaceDto } from './dto/update-space.dto'; 
import type { CreateSpaceDto } from './dto/create-space.dto';  
import { PrismaService } from 'src/prisma/prisma.service';
import { Space } from '@prisma/client';

@Injectable()
export class SpacesService {

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSpaceDto): Promise<Space> {
    const { name, description, capacity } = dto;

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
    const existingSpace = await this.prisma.space.findUnique({
      where: { id },
    });
    
    if (!existingSpace) {
      throw new NotFoundException('Space not found');
    }
    return existingSpace
  }

  async update(id: number, dto: UpdateSpaceDto): Promise<Space> {
    const existingSpace = await this.prisma.space.findUnique({
      where: { id },
    });

    if (!existingSpace) {
      throw new NotFoundException('Space not found');
    }

    if (dto.name && dto.name !== existingSpace.name) {
      const nameExists = await this.prisma.user.findUnique({
        where: { email: dto.name },
      });
      if (nameExists) throw new ConflictException('Name already in use');
    }

    return this.prisma.space.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });
  }

  async softDelete(id: number): Promise<Space> {
    const space = await this.prisma.space.findUnique({
      where: { id },
    });

    if (!space) {
      throw new NotFoundException(`Space with id ${id} not found`);
    }

    if(space.status === "INACTIVE") { throw new ConflictException("Space is already INACTIVE") };

    const bookings = await this.prisma.reservation.findMany({
      where: { spaceId: id },
    });

    if (bookings.length > 0) {
      throw new ConflictException('Cannot delete space with existing bookings');
    }

    return this.prisma.space.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        updatedAt: new Date(),
      }
    });
  }
}
