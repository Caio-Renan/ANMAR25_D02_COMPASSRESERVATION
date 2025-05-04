import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Put,
} from '@nestjs/common';
import { ResourcesSevice } from './resources.service';
import { CreateResourceDto } from './dto/create-resource-dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ParamId } from 'src/common/decorators/param-id.decorator';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesSevice) {}

  @Post()
  async create(@Body() data: CreateResourceDto) {
    return this.resourcesService.create(data);
  }

  @Get()
  async findAll() {
    return this.resourcesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.resourcesService.findOne(id);
  }

  @Patch(':id')
  async updatePartial(@Body() data: UpdateResourceDto, @ParamId() id: number) {
    return this.resourcesService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.resourcesService.softDelete(id);
  }
}
