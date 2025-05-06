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
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ResourcesSevice } from './resources.service';
import { CreateResourceDto } from './dto/create-resource-dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enum/roles.enum';
import { CurrentUser, Roles } from 'src/common/decorators';
import { FilterResourcesDto } from './dto/filter-resources.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { ThrottlerGuard } from '@nestjs/throttler';


@ApiTags('Resources')
@ApiBearerAuth()
@Controller('resources')
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), RolesGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesSevice) { }

  @ApiOperation({ summary: 'Create a new resource' })
  @ApiBody({
    type: CreateResourceDto,
    examples: {
      default: {
        summary: 'Example Create Resource Body',
        value: {
          name: 'Projector',
          description: 'A high-quality projector',
          quantity: 10,
        },
      },
      empty: {
        summary: 'Empty Body',
        value: {},
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Resource created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Projector',
        description: 'A high-quality projector',
        quantity: 10,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateResourceDto) {
    return this.resourcesService.create(dto);
  }

  @ApiOperation({ summary: 'Get all resources' })
  @ApiResponse({
    status: 200,
    description: 'List of resources',
    schema: {
      example: [
        {
          id: 1,
          name: 'Projector',
          description: 'A high-quality projector',
          quantity: 10,
        },
      ],
    },
  })
  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async findAll(@Query() filter: FilterResourcesDto) {
      return this.resourcesService.findAll(filter);
  }

  @ApiOperation({ summary: 'Get a resource by ID' })
  @ApiParam({ name: 'id', description: 'Resource ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Resource found',
    schema: {
      example: {
        id: 1,
        name: 'Projector',
        description: 'A high-quality projector',
        quantity: 10,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return this.resourcesService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Update a resource' })
  @ApiParam({ name: 'id', description: 'Resource ID', example: 1 })
  @ApiBody({
    type: UpdateResourceDto,
    examples: {
      default: {
        summary: 'Example Update Resource Body',
        value: {
          name: 'Updated Projector',
          description: 'Updated description',
        },
      },
      empty: {
        summary: 'Empty Body',
        value: {},
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Resource updated successfully',
    schema: {
      example: {
        id: 1,
        name: 'Updated Projector',
        description: 'Updated description',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(@Body() dto: CreateResourceDto, @Param() params: IdParamDto) {
    return this.resourcesService.update(params.id, dto);

  }

  @ApiOperation({ summary: 'Delete a resource by ID' })
  @ApiParam({ name: 'id', description: 'Resource ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Resource soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param() params: IdParamDto) {
    return this.resourcesService.softDelete(params.id);
  }
}