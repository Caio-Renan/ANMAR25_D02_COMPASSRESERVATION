import { Body, Controller, Get, Patch, Param, Post, Query, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enum/roles.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { AuthenticatedUser } from 'src/auth/types/authenticated-user';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      default: {
        summary: 'Example Create User Body',
        value: {
          name: 'Thiago Sampaio',
          email: 'thiago.sampaio@compass.com',
          password: 'StrongPassword123!',
          phone: '+55 (71) 98765-4321',
        },
      },
      empty: {
        summary: 'Empty Body',
        value: {},
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User created successfully', schema: { example: { id: 1, name: 'Thiago Sampaio', email: 'thiago.sampaio@compass.com' } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Update a user partially' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      default: {
        summary: 'Example Update User Body',
        value: {
          name: 'Thiago Sampaio Updated',
          phone: '+55 (71) 91234-5678',
        },
      },
      empty: {
        summary: 'Empty Body',
        value: {},
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User updated successfully', schema: { example: { id: 1, name: 'Thiago Sampaio Updated', email: 'Thiago.sampaio@compass.com', phone: '+55 (71) 91234-5678' } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  async updatePartial(
    @Param() params: IdParamDto,
    @Body() dto: UpdateUserDto,
    @Req() req: Request
  ) {
    const user = req.user as AuthenticatedUser;
    return this.usersService.update(params.id, dto, user);
  }

  @ApiOperation({ summary: 'Get all users with optional filters' })
  @ApiQuery({ name: 'name', description: 'Filter by name', required: false, example: 'Thiago Sampaio' })
  @ApiQuery({ name: 'email', description: 'Filter by email', required: false, example: 'Thiago.sampaio@compass.com' })
  @ApiQuery({ name: 'status', enum: ['ACTIVE', 'INACTIVE'], description: 'Filter by status', required: false })
  @ApiQuery({ name: 'page', description: 'Page number for pagination', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    schema: {
      example: {
        data: [
          { id: 1, name: 'Thiago Sampaio', email: 'Thiago.sampaio@compass.com', phone: '+55 (71) 98765-4321', status: 'ACTIVE', role: 'USER', createdAt: '2023-01-01T10:00:00.000Z', updatedAt: '2023-01-01T10:00:00.000Z' },
        ],
        total: 1,
        currentPage: 1,
        totalPages: 1,
      },
    },
  })
  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query() filter: FilterUserDto) {
    return this.usersService.findAll(filter);
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User found', schema: { example: { id: 1, name: 'Thiago Sampaio', email: 'Thiago.sampaio@compass.com', phone: '+55 (71) 98765-4321', status: 'ACTIVE', role: 'USER', createdAt: '2023-01-01T10:00:00.000Z', updatedAt: '2023-01-01T10:00:00.000Z' } } })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  async findOne(@Param() params: IdParamDto, @CurrentUser() user: AuthenticatedUser) {
    if( user.role === Role.USER && user.id !== params.id){
      throw new ForbiddenException('Users can only access their own data.')
    }
    return this.usersService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Soft delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User soft deleted successfully', schema: { example: { id: 1, name: 'Thiago Sampaio', email: 'Thiago.sampaio@compass.com', phone: '+55 (71) 98765-4321', status: 'INACTIVE', role: 'USER', createdAt: '2023-01-01T10:00:00.000Z', updatedAt: '2023-01-01T10:00:00.000Z' } } })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  async softDelete(@Param() params: IdParamDto, @CurrentUser() user: AuthenticatedUser) {
    if (user.role === Role.USER && user.id !== params.id){
      throw new ForbiddenException('Users can only delete their own data.')
    }
    return this.usersService.softDelete(params.id);
  }
}