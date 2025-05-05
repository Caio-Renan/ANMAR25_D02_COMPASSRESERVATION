import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe, UseGuards } from "@nestjs/common";
import { createSpaceDto } from "./dto/create-space-dto";
import { updateSpaceDto } from "./dto/update-space-dto";
import { SpacesService } from "./spaces.service";
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Spaces')
@ApiBearerAuth()

@Controller('spaces')
@UseGuards(AuthGuard('jwt'))
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @ApiOperation({ summary: 'Create a new space' })
  @ApiBody({
    type: createSpaceDto,
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
  @Post()
  async create(@Body() createSpaceDto: createSpaceDto) {
    try {
      return await this.spacesService.create(createSpaceDto);
    } catch (error) {
      if (error.message === 'Space with this name already exists') {
        throw new HttpException('Name is already registered.', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get all spaces' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'List of spaces', schema: { example: [{ id: 1, name: 'Conference Room A', description: 'A large conference room with a projector', capacity: 50 }] } })
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.spacesService.findAll(page, limit);
  }

  @ApiOperation({ summary: 'Get a space by ID' })
  @ApiParam({ name: 'id', description: 'Space ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Space found', schema: { example: { id: 1, name: 'Conference Room A', description: 'A large conference room with a projector', capacity: 50 } } })
  @ApiResponse({ status: 404, description: 'Space not found' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const space = await this.spacesService.findOne(id);

    if (!space) {
      throw new HttpException('Space not found', HttpStatus.NOT_FOUND);
    }

    return space;
  }

  @ApiOperation({ summary: 'Update a space' })
  @ApiParam({ name: 'id', description: 'Space ID', example: 1 })
  @ApiBody({
    type: updateSpaceDto,
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
  @ApiResponse({ status: 200, description: 'Space updated successfully', schema: { example: { id: 1, name: 'Updated Conference Room A', description: 'Updated description', capacity: 60 } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Patch(':id')
  update(@Param('id') id: number, @Body(new ValidationPipe()) updateSpaceDto: updateSpaceDto) {
    return this.spacesService.update(id, updateSpaceDto);
  }

  @ApiOperation({ summary: 'Delete a space by ID' })
  @ApiParam({ name: 'id', description: 'Space ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Space deleted successfully' })
  @ApiResponse({ status: 404, description: 'Space not found' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.spacesService.remove(id);
  }
}