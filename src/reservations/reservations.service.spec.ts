import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationValidationService } from './reservationsValidate.service';
import { EmailService } from '../email/email.service';
import { ReservationService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation-dto';
import { ReservationStatus } from '@prisma/client';
import { UpdateReservationDto } from './dto/update-reservation-dto';

describe('ReservationService', () => {
  let service: ReservationService;
  let prisma: PrismaService;
  let validationService: ReservationValidationService;
  let emailService: EmailService;

  const mockPrisma = {
    reservation: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    resource: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    client: {
      findUnique: jest.fn(),
    },
  };

  const mockValidationService = {
    isSpaceActive: jest.fn(),
    isResourceActiveAndEnough: jest.fn(),
    isDateAvailable: jest.fn(),
    verifyClient: jest.fn(),
    updateQuantity: jest.fn(),
  };

  const mockEmailService = {
    sendReservationApprovalEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: PrismaService, useValue: mockPrisma },
        {
          provide: ReservationValidationService,
          useValue: mockValidationService,
        },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    prisma = module.get<PrismaService>(PrismaService);
    validationService = module.get<ReservationValidationService>(
      ReservationValidationService,
    );
    emailService = module.get<EmailService>(EmailService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw error for inactive space', async () => {
      mockValidationService.isSpaceActive.mockResolvedValue(false);
      const dto = getValidCreateDto();

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should create reservation when valid', async () => {
      mockValidationService.isSpaceActive.mockResolvedValue(true);
      mockValidationService.isResourceActiveAndEnough.mockResolvedValue(true);
      mockValidationService.isDateAvailable.mockResolvedValue(true);
      mockValidationService.verifyClient.mockResolvedValue(true);

      const mockReservation = {
        id: 1,
        ...getValidCreateDto(),
        status: 'OPEN',
        resources: [{ resource: { name: 'Chair' }, quantity: 2 }],
      };

      mockPrisma.reservation.create.mockResolvedValue(mockReservation);

      const result = await service.create(getValidCreateDto());

      expect(result).toEqual(
        expect.objectContaining({
          id: 1,
          status: 'OPEN',
          resources: expect.arrayContaining([
            expect.objectContaining({ resource: 'Chair', quantity: 2 }),
          ]),
        }),
      );
      expect(mockPrisma.reservation.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated reservations', async () => {
      const mockData = [
        {
          id: 1,
          status: 'OPEN',
          client: { name: 'John' },
          space: { name: 'Room 1' },
          resources: [],
        },
      ];

      mockPrisma.reservation.findMany.mockResolvedValue(mockData);
      mockPrisma.reservation.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual(
        expect.objectContaining({
          data: mockData,
          meta: {
            total: 1,
            page: 1,
            lastPage: 1,
          },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should throw error if reservation not found', async () => {
      mockPrisma.reservation.count.mockResolvedValue(0);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePartial', () => {
    it('should prevent changing status to CANCELED', async () => {
      const mockReservation = { id: 1, status: 'OPEN' };
      mockPrisma.reservation.findUnique.mockResolvedValue(mockReservation);

      mockPrisma.reservation.count.mockResolvedValue(1);

      mockPrisma.reservation.findUnique.mockResolvedValue(mockReservation);

      const dto: UpdateReservationDto = { status: 'CANCELED' };

      await expect(service.updatePartial(1, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should send approval email when status changes to APPROVED', async () => {
      const mockReservation = {
        id: 1,
        status: 'OPEN',
        clientId: 1,
        spaceId: 1,
        startDate: new Date(),
        endDate: new Date(),
      };
      const mockClient = { email: 'test@test.com', name: 'John' };

      mockPrisma.reservation.findUnique.mockResolvedValue(mockReservation);
      mockPrisma.client.findUnique.mockResolvedValue(mockClient);

      await service.updatePartial(1, { status: 'APPROVED' });

      expect(mockEmailService.sendReservationApprovalEmail).toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    it('should prevent canceling non-OPEN reservations', async () => {
      const mockReservation = { id: 1, status: 'APPROVED' };
      mockPrisma.reservation.findUnique.mockResolvedValue(mockReservation);

      await expect(service.softDelete(1)).rejects.toThrow(BadRequestException);
    });
  });

  function getValidCreateDto(): CreateReservationDto {
    return {
      spaceId: 1,
      clientId: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 3600 * 1000),
      resources: [{ resourceId: 1, quantity: 2 }],
    };
  }
});
