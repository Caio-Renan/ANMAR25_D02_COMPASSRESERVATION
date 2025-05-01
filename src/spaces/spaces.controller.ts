import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { createSpaceDto } from "./dto/create-space-dto";
import { updateSpaceDto } from "./dto/update-space-dto";
import { SpacesService } from "./spaces.service";

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  async create(@Body() createSpaceDto: createSpaceDto) {

    try {
      return await this.spacesService.create(createSpaceDto);
    } catch (error) {
      if (error.message === 'Space with this name already exists') {
        throw new HttpException(
          'Name is already registered.',  
          HttpStatus.BAD_REQUEST,      
        );
      }
     
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.spacesService.findAll(page, limit);
  }

  @Get(':id')
  
  async findOne(@Param('id') id: string) {
    const space = await this.spacesService.findOne(id);

    if (!space) {
      throw new HttpException('Space not found', HttpStatus.NOT_FOUND);
    }

    return space;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateSpaceDto: updateSpaceDto) {
    return this.spacesService.update(id, updateSpaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spacesService.remove(id);
  }
}
