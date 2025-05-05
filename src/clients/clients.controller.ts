import { Body, Controller, Get, Patch, Post, Query, Delete, UseGuards  } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilterClientDto } from './dto/filter-client.dto';
import { ParamId } from '../common/decorators/param-id.decorator';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

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
          birthDate: '1990-01-01',
        },
      },
      empty: {
        summary: 'Empty Body',
        value: {},
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Client created successfully', schema: { example: { id: 1, name: 'Thiago Sampaio', cpf: '123.456.789-00', email: 'thiago.sampaio@compass.com', phone: '+55 (71) 98765-4321', birthDate: '1990-01-01' } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post()
  async create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
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
  @ApiResponse({ status: 200, description: 'Client updated successfully', schema: { example: { id: 1, name: 'Thiago Sampaio Updated', phone: '+55 (71) 91234-5678' } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Patch(':id')
  async updatePartial(@ParamId() id: number, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Get all clients' })
  @ApiQuery({ name: 'name', description: 'Filter by name', required: false, example: 'Thiago Sampaio' })
  @ApiQuery({ name: 'email', description: 'Filter by email', required: false, example: 'thiago.sampaio@compass.com' })
  @ApiResponse({ status: 200, description: 'List of clients', schema: { example: [{ id: 1, name: 'Thiago Sampaio', email: 'thiago.sampaio@compass.com' }] } })
  @Get()
  async findAll(@Query() filter: FilterClientDto) {
    return this.clientsService.findAll(filter);
  }

  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Client found', schema: { example: { id: 1, name: 'Thiago Sampaio', email: 'thiago.sampaio@compass.com' } } })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @Get(':id')
  async findOne(@ParamId() id: number) {
    return this.clientsService.findById(id);
  }

  @ApiOperation({ summary: 'Soft delete a client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Client soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @Delete(':id')
  async softDelete(@ParamId() id: number) {
    return this.clientsService.softDelete(id);
  }
}