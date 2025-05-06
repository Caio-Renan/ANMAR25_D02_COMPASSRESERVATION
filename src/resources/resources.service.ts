import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource-dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { getPaginationParams, buildPaginatedResponse } from 'src/common/utils/pagination.util';
import { FilterResourcesDto } from './dto/filter-resources.dto'
import { Prisma } from '@prisma/client';
import { ResourceValidationService } from './resourcesValidate.service';
@Injectable()
export class ResourcesSevice {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: ResourceValidationService,
  ) {}


  async create(dto: CreateResourceDto) {
    await this.validationService.validateResourceFields(dto);

    return this.prisma.resource.create({ data: dto });
  }

  async findAll(filter: FilterResourcesDto) {
      const page = parseInt(filter.page?.toString() || '1', 10);
      const limit = parseInt(filter.limit?.toString() || '10', 10);
  
      const { skip, take } = getPaginationParams({ page, limit});
        
      const where: Prisma.ResourceWhereInput = {};
    
      if (filter.name) {
        where.name = { contains: filter.name };
      }
    
      if (filter.status) {
        where.status = filter.status;
      }
    
      const [data, total] = await Promise.all([
        this.prisma.resource.findMany({
          where,
          skip,
          take,
        }),
        this.prisma.resource.count({ where }),
      ]);
    
      return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: number) {
    await this.validationService.getResourceOrFail(id);
    return this.prisma.resource.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateResourceDto) {
    await this.validationService.getResourceOrFail(id);

    await this.validationService.validateResourceFields(dto);

    return this.prisma.resource.update({ where: { id }, data: dto });
  }

  async softDelete(id: number) {
    const resource = await this.validationService.getResourceOrFail(id);

    if (resource.status === 'INACTIVE') {
      throw new BadRequestException('Resource is already inactive');
    }

    return this.prisma.resource.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        updatedAt: new Date(),
      },
    });
  }
}
