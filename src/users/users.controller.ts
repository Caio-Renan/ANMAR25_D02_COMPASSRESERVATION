import { Body, Controller, Get, Patch, Post, Query, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto'
import { FilterUserDTO } from './dto/filter-user.dto'
import { ParamId } from '../common/decorators/param-id.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    async create(@Body() dto: CreateUserDTO) {
      return this.usersService.create(dto);
    }
  
    @Patch(':id')
    async updatePartial(@ParamId() id: number, @Body() dto: UpdateUserDTO) {
      return this.usersService.update(id, dto);
    }
  
    @Get()
    async findAll(@Query() filter: FilterUserDTO) {
      return this.usersService.findAll(filter);
    }
  
    @Get(':id')
    async findOne(@ParamId() id: number) {
      return this.usersService.findById(id);
    }
  
    @Delete(':id')
    async softDelete(@ParamId() id: number) {
      return this.usersService.softDelete(id);
    }
}