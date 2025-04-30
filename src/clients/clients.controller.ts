import { Body, Controller, Post } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientsService } from './clients.service';
import { Param, Patch } from '@nestjs/common';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients') 
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(Number(id), updateClientDto);
  }

}


