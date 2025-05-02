import { Body, Controller, Get, Patch, Post, Query, Delete } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilterClientDto } from './dto/filter-client.dto';
import { ParamId } from '../common/decorators/param-id.decorator';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Patch(':id')
  async updatePartial(@ParamId() id: number, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Get()
  async findAll(@Query() filter: FilterClientDto) {
    return this.clientsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@ParamId() id: number) {
    return this.clientsService.findById(id);
  }

  @Delete(':id')
  async softDelete(@ParamId() id: number) {
    return this.clientsService.softDelete(id);
  }
}
