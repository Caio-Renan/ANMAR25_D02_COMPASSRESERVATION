import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation-dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(@Body() data: CreateReservationDto) {
    return this.reservationService.create(data);
  }

  @Get()
  async findAll() {
    return this.reservationService.findAll();
  }

  @Get('id')
  async findOne(@Param() id: number) {
    return this.reservationService.findOne(id);
  }

  @Put('id')
  async update(@Param() id: number) {
    return this.reservationService.update(id);
  }

  @Delete('id')
  async delete(@Param() id: number) {
    return this.reservationService.delete(id);
  }
}
