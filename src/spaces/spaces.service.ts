import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SpacesRepository } from './spaces.repository';
import { createSpaceDto } from './dto/create-space-dto';
import { updateSpaceDto } from './dto/update-space-dto';
import { Space } from '@prisma/client';

@Injectable()
export class SpacesService {
  constructor(private readonly spacesRepository: SpacesRepository) {}

  async create(createSpaceDto: createSpaceDto): Promise<Space> {
    return this.spacesRepository.create(createSpaceDto);
  }

  async findAll(page: number, limit: number): Promise<Space[]> {
    try {
      
      if (page <= 0 || limit <= 0) {
        throw new HttpException('Page and limit must be greater than 0', HttpStatus.BAD_REQUEST);
      }
  
      const skip = (page - 1) * limit;
      const take = limit;
  
      const spaces = await this.spacesRepository.findAll(skip, take);
  
      if (spaces.length === 0) {
        throw new HttpException('No spaces found', HttpStatus.NOT_FOUND);
      }
  
      return spaces;
    } catch (error) {
      console.error('Error fetching spaces:', error);
  
 
      throw new HttpException(
        'Error fetching spaces', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string): Promise<Space | null> {
    return this.spacesRepository.findOne(parseInt(id, 10));
  }

  async update(id: string, updateSpaceDto: updateSpaceDto): Promise<Space> {
    return this.spacesRepository.update(parseInt(id, 10), updateSpaceDto);
  }

  async remove(id: string): Promise<void> {
    await this.spacesRepository.remove(parseInt(id, 10));
  }
}
