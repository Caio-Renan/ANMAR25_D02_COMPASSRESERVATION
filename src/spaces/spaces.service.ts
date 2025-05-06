import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateSpaceDto } from './dto/update-space.dto'; 
import type { CreateSpaceDto } from './dto/create-space.dto';  
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Space, Status } from '@prisma/client';
import { FilterSpaceDto } from './dto/filter-space.dto';
import { getPaginationParams, buildPaginatedResponse } from 'src/common/utils/pagination.util';
import { SpaceValidationService } from './spacesValidate.service';
@Injectable()
export class SpacesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: SpaceValidationService
  ) {}

  async create(dto: CreateSpaceDto): Promise<Space> {

    await this.validationService.validateSpaceFields(dto);

    return this.prisma.space.create({ data: dto });
  }

  async findAll(filter: FilterSpaceDto) {
    const page = parseInt(filter.page?.toString() || '1', 10);
    const limit = parseInt(filter.limit?.toString() || '10', 10);
  
    const { skip, take } = getPaginationParams({ page, limit });
  
    const where: Prisma.SpaceWhereInput = {};
  
    if (filter.name) {
      where.name = { contains: filter.name };
    }
  
    if (filter.capacity) {
      where.capacity = { gte: filter.capacity };
    }
  
    if (filter.status) {
      where.status = filter.status;
    }
  
    const [data, total] = await Promise.all([
      this.prisma.space.findMany({ where, skip, take }),
      this.prisma.space.count({ where }),
    ]);
  
    return buildPaginatedResponse(data, total, page, limit);
  }
  

  async findOne(id: number): Promise<Space | null> {
    await this.validationService.getSpaceOrFail(id)
    return this.prisma.space.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateSpaceDto): Promise<Space> {
    await this.validationService.getSpaceOrFail(id);

    await this.validationService.validateSpaceFields(dto);

    return this.prisma.space.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });
  }

  async softDelete(id: number): Promise<Space> {
    const space = await this.validationService.getSpaceOrFail(id);

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
