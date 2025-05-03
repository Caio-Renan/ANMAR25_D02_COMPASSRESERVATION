import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Put } from '@nestjs/common';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  async create(@Body() data: { name: string; quantity: number; description: string }) {
    return this.resourcesService.createResource(data);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.resourcesService.findAll(page, limit);
  }   

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.resourcesService.findOne(id);
  }

  @Patch(':id')
  async update(@Body() data: Partial<{ name: string; quantity: number; description: string }>, @Param('id') id: number) {
    return this.resourcesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.resourcesService.delete(id);
  }
}