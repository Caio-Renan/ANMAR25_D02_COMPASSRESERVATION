import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto'
import { FilterUserDTO } from './dto/filter-user.dto'
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { getPaginationParams, buildPaginatedResponse } from '../common/utils/pagination.util'

const userSelectWithoutPassword: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDTO) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingEmail) throw new ConflictException('email already registered');

    const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
    });
    
    if (existingPhone) throw new ConflictException('phone already registered');
    
    const hash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        ...dto,
        password: hash,
        status: 'ACTIVE',
      },
    });
  }

  async update(id: number, dto: UpdateUserDTO) {
    await this.isIdValueCorrect(id);
    
    const user = await this.checkIfUserExists(id);

    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (emailExists) throw new ConflictException('email already registered');
    }

    if (dto.phone && dto.phone !== user.phone) {
      const phoneExists = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (phoneExists) throw new ConflictException('phone already registered');
    }

    let password = user.password;
    if (dto.password) {
      password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        password,
        updatedAt: new Date(),
      },
    });
  }

  async findAll(filter: FilterUserDTO) {
    const page = parseInt(filter.page?.toString() || '1', 10);
    const limit = parseInt(filter.limit?.toString() || '10', 10);

    const { skip, take } = getPaginationParams({ page, limit});
      
    const where: Prisma.UserWhereInput = {};
  
    if (filter.name) {
      where.name = { contains: filter.name };
    }
  
    if (filter.email) {
      where.email = { contains: filter.email };
    }
  
    if (filter.status) {
      where.status = filter.status;
    }
  
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        select: userSelectWithoutPassword,
      }),
      this.prisma.user.count({ where }),
    ]);
  
    return buildPaginatedResponse(data, total, page, limit);
  }

  async findById(id: number) {
    await this.isIdValueCorrect(id);

    const user = await this.checkIfUserExists(id, userSelectWithoutPassword);

    return user;
  }

  async softDelete(id: number) {

    await this.isIdValueCorrect(id);

    const user = await this.checkIfUserExists(id);

    if(user.status === "INACTIVE") { throw new ConflictException("user is already INACTIVE") };

    return this.prisma.user.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        updatedAt: new Date(),
      }, select: userSelectWithoutPassword
    });
  }

  async isIdValueCorrect(id: number) {
    if (Number.isNaN(id)) {
      throw new BadRequestException('id must be a number');
    }

    if (id < 1) { throw new BadRequestException('id must be greater than or equal to 1');}
  }

  async checkIfUserExists(id: number, select?: Prisma.UserSelect): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id }, select: select
    });
  
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  } 
}