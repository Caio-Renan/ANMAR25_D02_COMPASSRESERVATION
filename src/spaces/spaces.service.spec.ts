import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { PrismaService } from '../prisma/prisma.service';
import { SpaceValidationService } from './spacesValidate.service';
import { Space, Status } from '@prisma/client';
import { CreateSpaceDto } from './dto/create-space.dto';

describe('SpacesService', () => {
  let service: SpacesService;
  let prisma: PrismaService;
  let validationService: SpaceValidationService;

  const mockPrisma = {
    space: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    reservation: {
      findMany: jest.fn(),
    },
  };

  const mockValidationService = {
    validateSpaceFields: jest.fn(),
    getSpaceOrFail: jest.fn(),
    ensureSpaceIsActive: jest.fn(),
    validateNoBookings: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpacesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SpaceValidationService, useValue: mockValidationService },
      ],
    }).compile();

    service = module.get<SpacesService>(SpacesService);
    prisma = module.get<PrismaService>(PrismaService);
    validationService = module.get<SpaceValidationService>(
      SpaceValidationService,
    );

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new space', async () => {
      const dto = {
        name: 'Meeting Room',
        description: 'Large conference room',
        capacity: 20,
      };

      const mockSpace = { id: 1, ...dto, status: 'ACTIVE' };
      mockPrisma.space.create.mockResolvedValue(mockSpace);

      const result = await service.create(dto);

      expect(result).toEqual(mockSpace);
      expect(mockValidationService.validateSpaceFields).toHaveBeenCalledWith(
        dto,
      );
    });

    it('should throw ConflictException for duplicate name', async () => {
      const dto: CreateSpaceDto = {
        name: 'Duplicate Room',
        description: 'Team meeting room',
        capacity: 10,
      };

      mockValidationService.validateSpaceFields.mockRejectedValue(
        new ConflictException('Space already registered'),
      );

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    describe('findAll', () => {
      it('should return paginated spaces with filters', async () => {
        const mockSpaces = [
          { id: 1, name: 'Room A', capacity: 10 },
          { id: 2, name: 'Room B', capacity: 15 },
        ];

        mockPrisma.space.findMany.mockResolvedValue(mockSpaces);
        mockPrisma.space.count.mockResolvedValue(2);

        const filter = {
          page: 1,
          limit: 10,
          name: 'Room',
          capacity: 10,
          status: Status.ACTIVE,
        };

        const result = await service.findAll(filter);

        expect(result).toEqual(
          expect.objectContaining({
            data: mockSpaces,
            meta: {
              total: 2,
              page: 1,
              lastPage: 1,
            },
          }),
        );
        expect(mockPrisma.space.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {
              name: { contains: 'Room' },
              capacity: { gte: 10 },
              status: 'ACTIVE',
            },
          }),
        );
      });
    });

    describe('findOne', () => {
      it('should return a space by id', async () => {
        const mockSpace = { id: 1, name: 'Test Space' };
        mockValidationService.getSpaceOrFail.mockResolvedValue(mockSpace);
        mockPrisma.space.findUnique.mockResolvedValue(mockSpace);

        const result = await service.findOne(1);

        expect(result).toEqual(mockSpace);
        expect(mockValidationService.getSpaceOrFail).toHaveBeenCalledWith(1);
      });

      it('should throw NotFoundException for non-existent space', async () => {
        mockValidationService.getSpaceOrFail.mockRejectedValue(
          new NotFoundException('Space not found'),
        );

        await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      });
    });

    describe('update', () => {
      it('should update a space', async () => {
        const dto = { name: 'Updated Name' };
        const mockSpace = { id: 1, ...dto };

        mockValidationService.getSpaceOrFail.mockResolvedValue(mockSpace);

        mockValidationService.validateSpaceFields.mockResolvedValue(undefined);

        mockPrisma.space.update.mockResolvedValue(mockSpace);

        const result = await service.update(1, dto);

        expect(result).toEqual(mockSpace);
        expect(mockValidationService.validateSpaceFields).toHaveBeenCalledWith(
          dto,
        );
      });

      it('should throw ConflictException for duplicate name on update', async () => {
        const dto = { name: 'Duplicate' };
        mockValidationService.validateSpaceFields.mockRejectedValue(
          new ConflictException('Space already registered'),
        );

        await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
      });
    });

    describe('softDelete', () => {
      it('should deactivate a space', async () => {
        const activeSpace = {
          id: 1,
          status: 'ACTIVE' as Status,
          updatedAt: new Date(),
        };

        mockValidationService.getSpaceOrFail.mockResolvedValue(activeSpace);
        mockPrisma.space.update.mockResolvedValue({
          ...activeSpace,
          status: 'INACTIVE',
        });

        const result = await service.softDelete(1);

        expect(result.status).toBe('INACTIVE');
        expect(mockValidationService.ensureSpaceIsActive).toHaveBeenCalled();
        expect(mockValidationService.validateNoBookings).toHaveBeenCalled();
      });

      it('should throw error for inactive space', async () => {
        const inactiveSpace = { id: 1, status: 'INACTIVE' as Status };
        mockValidationService.getSpaceOrFail.mockResolvedValue(inactiveSpace);
        mockValidationService.ensureSpaceIsActive.mockImplementation(() => {
          throw new BadRequestException('Space is already inactive');
        });

        await expect(service.softDelete(1)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should prevent deletion with active bookings', async () => {
        const activeSpace = { id: 1, status: 'ACTIVE' as Status };

        mockValidationService.getSpaceOrFail.mockResolvedValue(activeSpace);

        mockValidationService.ensureSpaceIsActive.mockResolvedValue(undefined);

        mockValidationService.validateNoBookings.mockImplementation(() => {
          throw new ConflictException(
            'Cannot delete space with existing bookings',
          );
        });

        await expect(service.softDelete(1)).rejects.toThrow(ConflictException);
      });
    });
  });
});
