import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation-dto';
import { UpdateReservationDto } from './dto/update-reservation-dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReservationStatus } from '@prisma/client';
import { FilterReservationDto } from './dto/filter-reservation.dto';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
@UseGuards(AuthGuard('jwt'))
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiBody({
    type: CreateReservationDto,
    examples: {
      default: {
        summary: 'Example Create Reservation Body',
        value: {
          clientId: 1,
          spaceId: 101,
          startDate: '2025-05-01',
          endDate: '2025-05-05',
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
    description: 'Reservation created successfully',
    schema: {
      example: {
        id: 1,
        clientId: 1,
        spaceId: 101,
        startDate: '2025-05-01',
        endDate: '2025-05-05',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post()
  async create(@Body() data: CreateReservationDto) {
    return this.reservationService.create(data);
  }

  @ApiOperation({ summary: 'Get all reservations' })
  @ApiQuery({
    name: 'cpf',
    required: false,
    type: String,
    description: 'CPF (optional)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ReservationStatus,
    description: 'Booking status (optional)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reservations',
    schema: {
      example: {
        total: 1,
        page: 1,
        lastPage: 1,
        data: [
          {
            id: 1,
            clientId: 1,
            spaceId: 1,
            startDate: '2025-04-12T00:00:00.000Z',
            endDate: '2025-04-13T00:00:00.000Z',
            status: 'OPEN',
            createdAt: '2025-05-04T18:56:17.645Z',
            updatedAt: '2025-05-04T18:56:17.645Z',
            closedAt: null,
          },
        ],
      },
    },
  })
  @Get()
  async findAll(@Query() filter: FilterReservationDto) {
    return this.reservationService.findAll(filter);
  }

  @ApiOperation({ summary: 'Get a reservation by ID' })
  @ApiParam({ name: 'id', description: 'Reservation ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Reservation found',
    schema: {
      example: {
        id: 1,
        clientId: 1,
        spaceId: 101,
        startDate: '2025-05-01',
        endDate: '2025-05-05',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a reservation' })
  @ApiParam({ name: 'id', description: 'Reservation ID', example: 1 })
  @ApiBody({
    type: UpdateReservationDto,
    examples: {
      default: {
        summary: 'Example Update Reservation Body',
        value: {
          spaceId: 102,
          startDate: '2025-05-02',
          endDate: '2025-05-06',
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
    description: 'Reservation updated successfully',
    schema: {
      example: {
        id: 1,
        clientId: 1,
        spaceId: 102,
        startDate: '2025-05-02',
        endDate: '2025-05-06',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @Patch(':id')
  async update(
    @Body() data: UpdateReservationDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reservationService.updatePartial(id, data);
  }

  @ApiOperation({ summary: 'Delete a reservation by ID' })
  @ApiParam({ name: 'id', description: 'Reservation ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Reservation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.softDelete(id);
  }
}
