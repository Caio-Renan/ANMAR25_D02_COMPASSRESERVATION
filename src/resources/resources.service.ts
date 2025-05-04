import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource-dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesSevice {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateResourceDto) {
    const resource = await this.prisma.resource.findUnique({
      where: { name: data.name },
    });

    if (resource) {
      throw new ConflictException('Resource already exists');
    }

    return this.prisma.resource.create({ data });
  }

  async findAll() {
    return this.prisma.resource.findMany();
  }

  async findOne(id: number) {
    await this.exists(id);
    return this.prisma.resource.findUnique({ where: { id } });
  }

  async updatePartial(id: number, data: UpdateResourceDto) {
    await this.exists(id);

    let resource;
    if (data.name) {
      resource = await this.prisma.resource.findUnique({
        where: { name: data.name },
      });
    }

    if (resource) {
      throw new ConflictException('Resource already exists');
    }

    return this.prisma.resource.update({ where: { id }, data });
  }

  async softDelete(id: number) {
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (resource?.status === 'INACTIVE') {
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

  async exists(id: number) {
    if (!(await this.prisma.resource.count({ where: { id } }))) {
      throw new NotFoundException('resource not found');
    }
  }
}
