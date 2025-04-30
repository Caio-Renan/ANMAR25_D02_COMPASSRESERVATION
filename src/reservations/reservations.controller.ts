import { Controller, Delete, Get, Post } from "@nestjs/common";
import { ReservationService } from "./reservations.service";


@Controller('reservations')
export class ReservationController{

     constructor(private readonly reservationService: ReservationService) {}

     @Post()
     
     @Get()

     @Get('id')

     @Put('id')

     @Delete('id')
}