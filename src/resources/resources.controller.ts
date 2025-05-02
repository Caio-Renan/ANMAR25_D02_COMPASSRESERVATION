import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  async create(@Body() data: { name: string; quantity: number; description: string }) {
    return this.resourcesService.createResource(data);
  }

  @Get()
  async findAll() {
    return this.resourcesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.resourcesService.findOne(id);
  }

  @Put(':id')
  async update(@Body() data: Partial<{ name: string; quantity: number; description: string }>, @Param('id') id: number) {
    return this.resourcesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.resourcesService.delete(id);
  }
}