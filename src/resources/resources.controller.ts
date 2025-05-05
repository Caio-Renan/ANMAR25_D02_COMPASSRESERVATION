import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Put } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource-dto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  async create(@Body() dto: CreateResourceDto) {
    return this.resourcesService.createResource(dto);
  }
 
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
    @Query('status') status?: string,
  ) {
    return this.resourcesService.findAll(page, limit, name, status);
  }
  

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.resourcesService.findOne(id);
  }

  @Patch(':id')
  async update(@Body() dto: CreateResourceDto, @Param('id') id: number) {
    return this.resourcesService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.resourcesService.delete(id);
  }
}