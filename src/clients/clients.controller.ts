import { Body, Controller, Param, Get, Patch, Post, Query, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilterClientDto } from './dto/filter-client.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enum/roles.enum';
import { CurrentUser, Roles } from 'src/common/decorators';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { AuthenticatedUser } from 'src/auth/types/authenticated-user';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  @ApiOperation({ summary: 'Create a new client' })
  @ApiBody({
    type: CreateClientDto,
    examples: {
      default: {
        summary: 'Example Create Client Body',
        value: {
          name: 'Thiago Sampaio',
          cpf: '123.456.789-00',
          email: 'thiago.sampaio@compass.com',
          phone: '+55 (71) 98765-4321',
          birthDate: '1990-01-01T00:00:00.000Z',
        },
      },
      empty: {
        summary: 'Empty Body',
        value: {},
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Client created successfully', schema: { example: { id: 1, name: 'Thiago Sampaio', cpf: '123.456.789-00', email: 'thiago.sampaio@compass.com', phone: '+55 (71) 98765-4321', birthDate: '1990-01-01T00:00:00.000Z' } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Roles(Role.ADMIN, Role.USER)
  @Post()
  async create(@Body() dto: CreateClientDto, @CurrentUser() user: AuthenticatedUser) {
    return this.clientsService.create(dto, user.id);
  }

  @ApiOperation({ summary: 'Update a client partially' })
  @ApiParam({ name: 'id', description: 'Client ID', example: 1 })
  @ApiBody({
    type: UpdateClientDto,
    examples: {
      default: {
        summary: 'Example Update Client Body',
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
  @ApiResponse({ status: 200, description: 'Client updated successfully', schema: { example: { id: 1, name: 'Thiago Sampaio Updated', cpf: '123.456.789-00', email: 'thiago.sampaio@compass.com', phone: '+55 (71) 91234-5678', birthDate: '1990-01-01T00:00:00.000Z' } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  async updatePartial(@Param() params: IdParamDto, @Body() dto: UpdateClientDto, @CurrentUser() user: AuthenticatedUser) {
    if (user.role === Role.USER) {
      const client = await this.clientsService.findById(params.id);
      if (client?.userId !== user.id) {
        throw new ForbiddenException('Users can only update their own clients.')
      }
    }
    return this.clientsService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'Get all clients' })
  @ApiQuery({ name: 'name', description: 'Filter by name', required: false, example: 'Thiago Sampaio' })
  @ApiQuery({ name: 'email', description: 'Filter by email', required: false, example: 'thiago.sampaio@compass.com' })
  @ApiQuery({ name: 'status', enum: ['ACTIVE', 'INACTIVE'], description: 'Filter by status', required: false })
  @ApiQuery({ name: 'cpf', description: 'Filter by CPF', required: false, example: '123.456.789-00' })
  @ApiQuery({ name: 'page', description: 'Page number for pagination', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of clients',
    schema: {
      example: {
        data: [
          { id: 1, name: 'Thiago Sampaio', cpf: '123.456.789-00', email: 'thiago.sampaio@compass.com', phone: '+55 (71) 98765-4321', birthDate: '1990-01-01T00:00:00.000Z', status: 'ACTIVE', createdAt: '2023-01-01T10:00:00.000Z', updatedAt: '2023-01-01T10:00:00.000Z' },
        ],
        total: 1,
        currentPage: 1,
        totalPages: 1,
      },
    },
  })
  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query() filter: FilterClientDto) {
    return this.clientsService.findAll(filter);
  }

  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Client found', schema: { example: { id: 1, name: 'Thiago Sampaio', cpf: '123.456.789-00', email: 'thiago.sampaio@compass.com', phone: '+55 (71) 98765-4321', birthDate: '1990-01-01T00:00:00.000Z', status: 'ACTIVE', createdAt: '2023-01-01T10:00:00.000Z', updatedAt: '2023-01-01T10:00:00.000Z' } } })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  async findOne(@Param() params: IdParamDto, @CurrentUser() user: AuthenticatedUser) {
    const client = await this.clientsService.findById(params.id);
    if (user.role === Role.USER && client.userId !== user.id) {
      throw new ForbiddenException('Users can only access their own clients.')
    }
    return client;
  }

  @ApiOperation({ summary: 'Soft delete a client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Client soft deleted successfully', schema: { example: { id: 1, name: 'Thiago Sampaio', cpf: '123.456.789-00', email: 'thiago.sampaio@compass.com', phone: '+55 (71) 98765-4321', birthDate: '1990-01-01T00:00:00.000Z', status: 'INACTIVE', createdAt: '2023-01-01T10:00:00.000Z', updatedAt: '2023-01-01T10:00:00.000Z' } } })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  async softDelete(@Param() params: IdParamDto) {
    return this.clientsService.softDelete(params.id);
  }

  @ApiOperation({ summary: 'Request email verification for a client' })
  @ApiParam({ name: 'id', description: 'Client ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Verification email sent successfully', schema: { example: { message: 'A verification email has been sent successfully' } } })
  @ApiResponse({ status: 403, description: 'Users can only request verification for their own clients.' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @Roles(Role.ADMIN, Role.USER)
  @Post(':id/request-email-verification')
  async requestEmailVerification(
    @Param() params: IdParamDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const client = await this.clientsService.findById(params.id);
    if (user.role === Role.USER && client.userId !== user.id) {
      throw new ForbiddenException('Users can only request verification for their own clients.');
    }
    await this.clientsService.validateMail(params.id);
    return { message: `A verification email has been sent to ${client.email}` };
  }
}