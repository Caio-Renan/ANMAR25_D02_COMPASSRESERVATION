import { Body, Controller, Get, Patch, Post, Query, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FilterUserDTO } from './dto/filter-user.dto';
import { ParamId } from '../common/decorators/param-id.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enum/roles.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { Request } from 'express';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUserDTO,
    examples: {
      default: {
        summary: 'Example Create User Body',
        value: {
          name: 'Thiago Sampaio',
          email: 'Thiago.sampaio@compass.com',
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
  @ApiResponse({ status: 201, description: 'User created successfully', schema: { example: { id: 1, name: 'Thiago Sampaio', email: 'Thiago.sampaio@compass.com' } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateUserDTO) {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Update a user partially' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({
    type: UpdateUserDTO,
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
  @ApiResponse({ status: 200, description: 'User updated successfully', schema: { example: { id: 1, name: 'Thiago Sampaio Updated', email: 'Thiago.sampaio@compass.com' } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  async updatePartial(
    @ParamId() id: number,
    @Body() dto: UpdateUserDTO,
    @Req() req: Request
  ) {
    const user = req.user as any;  
    return this.usersService.update(id, dto, user); 
  }

  @ApiOperation({ summary: 'Get all users with optional filters' })
  @ApiQuery({ name: 'name', description: 'Filter by name', required: false, example: 'Thiago Sampaio' })
  @ApiQuery({ name: 'email', description: 'Filter by email', required: false, example: 'Thiago.sampaio@compass.com' })
  @ApiResponse({ status: 200, description: 'List of users', schema: { example: [{ id: 1, name: 'Thiago Sampaio', email: 'Thiago.sampaio@compass.com' }] } })
  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query() filter: FilterUserDTO) {
    return this.usersService.findAll(filter);
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User found', schema: { example: { id: 1, name: 'Thiago Sampaio', email: 'Thiago.sampaio@compass.com' } } })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(@ParamId() id: number) {
    return this.usersService.findById(id);
  }
  @ApiOperation({ summary: 'Soft delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(Role.ADMIN)
  @Delete(':id')
  async softDelete(@ParamId() id: number) {
    return this.usersService.softDelete(id);
  }
}