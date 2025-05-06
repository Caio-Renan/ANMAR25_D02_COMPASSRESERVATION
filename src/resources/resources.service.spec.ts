import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ResourcesSevice } from './resources.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResourceValidationService } from './resourcesValidate.service';
import { Status } from '@prisma/client';
import { CreateResourceDto } from './dto/create-resource-dto';

describe('ResourcesSevice', () => {
  let service: ResourcesSevice;
  let prisma: PrismaService;
  let validationService: ResourceValidationService;

  const mockPrisma = {
    resource: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockValidationService = {
    validateResourceFields: jest.fn(),
    getResourceOrFail: jest.fn(),
    ensureResourceIsActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourcesSevice,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ResourceValidationService, useValue: mockValidationService },
      ],
    }).compile();

    service = module.get<ResourcesSevice>(ResourcesSevice);
    prisma = module.get<PrismaService>(PrismaService);
    validationService = module.get<ResourceValidationService>(
      ResourceValidationService,
    );

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new resource', async () => {
      const dto = {
        name: 'Projector',
        description: 'HD Video Projector',
        quantity: 5,
      };

      const mockResource = { id: 1, ...dto, status: 'ACTIVE' };
      mockPrisma.resource.create.mockResolvedValue(mockResource);

      const result = await service.create(dto);

      expect(result).toEqual(mockResource);
      expect(mockValidationService.validateResourceFields).toHaveBeenCalledWith(
        dto,
      );
    });

    it('should throw ConflictException for duplicate name', async () => {
      const dto: CreateResourceDto = {
        name: 'Duplicate Resource',
        description: 'Duplicate Resource Description',
        quantity: 5,
      };

      mockValidationService.validateResourceFields.mockRejectedValue(
        new ConflictException('Resource already registered'),
      );

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated resources with filters', async () => {
      const mockResources = [
        { id: 1, name: 'Chair', status: 'ACTIVE' },
        { id: 2, name: 'Table', status: 'ACTIVE' },
      ];

      mockPrisma.resource.findMany.mockResolvedValue(mockResources);
      mockPrisma.resource.count.mockResolvedValue(2);

      const filter = {
        page: 1,
        limit: 10,
        name: 'Cha',
        status: Status.ACTIVE,
      };

      const result = await service.findAll(filter);

      expect(result).toEqual(
        expect.objectContaining({
          data: mockResources,
          meta: {
            total: 2,
            page: 1,
            lastPage: 1,
          },
        }),
      );
      expect(mockPrisma.resource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            name: { contains: 'Cha' },
            status: 'ACTIVE',
          },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a resource by id', async () => {
      const mockResource = { id: 1, name: 'Whiteboard' };
      mockValidationService.getResourceOrFail.mockResolvedValue(mockResource);
      mockPrisma.resource.findUnique.mockResolvedValue(mockResource);

      const result = await service.findOne(1);

      expect(result).toEqual(mockResource);
      expect(mockValidationService.getResourceOrFail).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for non-existent resource', async () => {
      mockValidationService.getResourceOrFail.mockRejectedValue(
        new NotFoundException('Resource not found'),
      );

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a resource', async () => {
      const dto = { name: 'Updated Name', quantity: 10 };
      const mockResource = { id: 1, ...dto };

      mockValidationService.getResourceOrFail.mockResolvedValue(mockResource);

      mockValidationService.validateResourceFields.mockResolvedValue(undefined);

      mockPrisma.resource.update.mockResolvedValue(mockResource);

      const result = await service.update(1, dto);

      expect(result).toEqual(mockResource);
      expect(mockValidationService.validateResourceFields).toHaveBeenCalledWith(
        dto,
      );
    });

    it('should throw ConflictException for duplicate name on update', async () => {
      const dto = { name: 'Duplicate' };
      mockValidationService.validateResourceFields.mockRejectedValue(
        new ConflictException('Resource already registered'),
      );

      await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('softDelete', () => {
    it('should deactivate a resource', async () => {
      const activeResource = {
        id: 1,
        status: 'ACTIVE' as Status,
        updatedAt: new Date(),
      };

      mockValidationService.getResourceOrFail.mockResolvedValue(activeResource);
      mockPrisma.resource.update.mockResolvedValue({
        ...activeResource,
        status: 'INACTIVE',
      });

      const result = await service.softDelete(1);

      expect(result.status).toBe('INACTIVE');
      expect(mockValidationService.ensureResourceIsActive).toHaveBeenCalled();
    });

    it('should throw error for inactive resource', async () => {
      const inactiveResource = { id: 1, status: 'INACTIVE' as Status };
      mockValidationService.getResourceOrFail.mockResolvedValue(
        inactiveResource,
      );
      mockValidationService.ensureResourceIsActive.mockImplementation(() => {
        throw new BadRequestException('Resource is already inactive');
      });

      await expect(service.softDelete(1)).rejects.toThrow(BadRequestException);
    });
  });
});
