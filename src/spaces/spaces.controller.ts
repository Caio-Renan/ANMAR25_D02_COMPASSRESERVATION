import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe, UseGuards } from "@nestjs/common";
import { CreateSpaceDto } from "./dto/create-space.dto";
import { UpdateSpaceDto } from "./dto/update-space.dto";
import { SpacesService } from "./spaces.service";
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from "src/common/enum/roles.enum";
import { CurrentUser, Roles } from "src/common/decorators";
import { RolesGuard } from "src/common/guards/roles.guard";
import { IdParamDto } from "src/common/dto/id-param.dto";
import { FilterSpaceDto } from "./dto/filter-space.dto";
import { ThrottlerGuard } from "@nestjs/throttler";
@ApiTags('Spaces')
@ApiBearerAuth()
@Controller('spaces')
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), RolesGuard)
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) { }

  @ApiOperation({ summary: 'Create a new space' })
  @ApiBody({
    type: CreateSpaceDto,
    examples: {
      default: {
        summary: 'Example Create Space Body',
        value: {
          name: 'Conference Room A',
          description: 'A large conference room with a projector',
          capacity: 50,
        },
      },
      empty: {
        summary: 'Empty Body',
        value: {},
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Space created successfully', schema: { example: { id: 1, name: 'Conference Room A', description: 'A large conference room with a projector', capacity: 50 } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateSpaceDto) {
    return await this.spacesService.create(dto);
  }

  @ApiOperation({ summary: 'Get all spaces' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, example: 10 })
  @ApiResponse({
    status: 200, description: 'List of spaces',
    schema: {
      example:
        [{
          id: 1, name: 'Conference Room A',
          description: 'A large conference room with a projector', capacity: 50
        }]
    }
  })
  @Roles(Role.ADMIN, Role.USER) 
  @Get()
  async findAll(@Query() filter: FilterSpaceDto) {
      return this.spacesService.findAll(filter);
  }

  @ApiOperation({ summary: 'Get a space by ID' })
  @ApiParam({ name: 'id', description: 'Space ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Space found', schema: { example: { id: 1, name: 'Conference Room A', description: 'A large conference room with a projector', capacity: 50 } } })
  @ApiResponse({ status: 404, description: 'Space not found' })
  @Roles(Role.ADMIN, Role.USER) 
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return this.spacesService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Update a space' })
  @ApiParam({ name: 'id', description: 'Space ID', example: 1 })
  @ApiBody({
    type: UpdateSpaceDto,
    examples: {
      default: {
        summary: 'Example Update Space Body',
        value: {
          name: 'Updated Conference Room A',
          description: 'Updated description',
          capacity: 60,
        },
      },
      empty: {
        summary: 'Empty Body',
        value: {},
      },
    },
  })
  @ApiResponse({
    status: 200, description: 'Space updated successfully',
    schema: {
      example: {
        id: 1, name: 'Updated Conference Room A',
        description: 'Updated description', capacity: 60
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Roles(Role.ADMIN) 
  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body(new ValidationPipe()) dto: UpdateSpaceDto) {
    return this.spacesService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'Delete a space by ID' })
  @ApiParam({ name: 'id', description: 'Space ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Space deleted successfully' })
  @ApiResponse({ status: 404, description: 'Space not found' })
  @Roles(Role.ADMIN) 
  @Delete(':id')
  async delete(@Param() params: IdParamDto) {
    return this.spacesService.softDelete(params.id);
  }
}