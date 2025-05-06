import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserValidationService } from './usersValidate.service';
import * as bcrypt from 'bcrypt';
import { Role, Status, User } from '@prisma/client';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let validationService: UserValidationService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockValidationService = {
    validateUserFields: jest.fn(),
    getUserOrFail: jest.fn(),
    ensureUserIsActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: UserValidationService, useValue: mockValidationService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    validationService = module.get<UserValidationService>(
      UserValidationService,
    );

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      mockPrisma.user.create.mockResolvedValue({
        ...dto,
        id: 1,
        password: 'hashedPassword',
        status: 'ACTIVE',
      });

      const result = await service.create(dto);

      expect(result).toEqual(
        expect.objectContaining({
          id: 1,
          email: 'john@example.com',
          status: 'ACTIVE',
        }),
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockValidationService.validateUserFields).toHaveBeenCalledWith(
        dto,
      );
    });

    it('should throw ConflictException for duplicate email', async () => {
      const dto = {
        name: 'John Doe',
        email: 'duplicate@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      mockValidationService.validateUserFields.mockRejectedValue(
        new ConflictException('Email already registered'),
      );

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'oldPassword',
      status: 'ACTIVE',
      role: 'USER' as Role,
    };

    it('should update user with new password', async () => {
      const dto = {
        name: 'Updated Name',
        password: 'newPassword',
      };

      mockValidationService.getUserOrFail.mockResolvedValue(mockUser);

      mockValidationService.validateUserFields.mockResolvedValue(undefined);

      mockPrisma.user.update.mockResolvedValue({
        ...mockUser,
        ...dto,
        password: 'hashedPassword',
      });

      const result = await service.update(1, dto, { id: 1, role: 'USER' });

      expect(result.password).toBe('hashedPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
    });

    it('should prevent non-admin from updating other users', async () => {
      await expect(
        service.update(1, {}, { id: 2, role: 'USER' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow admin to update any user', async () => {
      mockValidationService.getUserOrFail.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(mockUser);

      await expect(
        service.update(1, {}, { id: 2, role: 'ADMIN' }),
      ).resolves.toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated users without passwords', async () => {
      const mockUsers = [
        { id: 1, name: 'John', email: 'john@example.com', status: 'ACTIVE' },
        { id: 2, name: 'Jane', email: 'jane@example.com', status: 'ACTIVE' },
      ];
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);
      mockPrisma.user.count.mockResolvedValue(2);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual(
        expect.objectContaining({
          data: mockUsers,
          meta: { total: 2, page: 1, lastPage: 1 },
        }),
      );

      const calledWith = mockPrisma.user.findMany.mock.calls[0][0];
      expect(calledWith.select).not.toHaveProperty('password');
    });
  });

  describe('findOne', () => {
    it('should return user without password', async () => {
      const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
      mockValidationService.getUserOrFail.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockValidationService.getUserOrFail).toHaveBeenCalledWith(
        1,
        expect.any(Object),
      );
    });

    it('should throw NotFoundException for non-existent user', async () => {
      mockValidationService.getUserOrFail.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete', () => {
    it('should deactivate active user', async () => {
      const activeUser = { id: 1, status: 'ACTIVE' as Status };
      mockValidationService.getUserOrFail.mockResolvedValue(activeUser);
      mockPrisma.user.update.mockResolvedValue({
        ...activeUser,
        status: 'INACTIVE',
      });

      const result = await service.softDelete(1);

      expect(result.status).toBe('INACTIVE');
      expect(mockValidationService.ensureUserIsActive).toHaveBeenCalled();
    });

    it('should throw error for already inactive user', async () => {
      const inactiveUser = { id: 1, status: 'INACTIVE' as Status };
      mockValidationService.getUserOrFail.mockResolvedValue(inactiveUser);
      mockValidationService.ensureUserIsActive.mockImplementation(() => {
        throw new BadRequestException('User is already inactive');
      });

      await expect(service.softDelete(1)).rejects.toThrow(BadRequestException);
    });
  });
});
