import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { ClientValidationService } from './clientsValidate.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Client, Prisma, Status } from '@prisma/client';

describe('ClientsService', () => {
  let service: ClientsService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let validationService: ClientValidationService;
  let emailService: EmailService;

  const mockClient: Client = {
    id: 1,
    name: 'Test Client',
    cpf: '12345678901',
    email: 'test@example.com',
    phone: '1234567890',
    birthDate: new Date('1990-01-01'),
    status: Status.ACTIVE,
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1,
  };

  const mockCreateClientDto = {
    name: 'Test Client',
    cpf: '12345678901',
    email: 'test@example.com',
    phone: '1234567890',
    birthDate: new Date('1990-01-01'),
  };

  const mockUpdateClientDto = {
    name: 'Updated Client',
    phone: '0987654321',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: PrismaService,
          useValue: {
            client: {
              create: jest.fn().mockResolvedValue(mockClient),
              update: jest.fn().mockResolvedValue({
                ...mockClient,
                ...mockUpdateClientDto,
                updatedAt: new Date(),
              }),
              findMany: jest.fn().mockResolvedValue([mockClient]),
              count: jest.fn().mockResolvedValue(1),
              findUnique: jest.fn().mockResolvedValue(mockClient),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
          },
        },
        {
          provide: ClientValidationService,
          useValue: {
            validateClientFields: jest.fn().mockResolvedValue(true),
            getClientOrFail: jest.fn().mockResolvedValue(mockClient),
            ensureClientIsActive: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendEmailVerification: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    validationService = module.get<ClientValidationService>(
      ClientValidationService,
    );
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a client and send verification email', async () => {
      const userId = 1;
      process.env.APP_URL = 'http://localhost:3000';

      const result = await service.create(mockCreateClientDto, userId);

      expect(validationService.validateClientFields).toHaveBeenCalledWith(
        mockCreateClientDto,
      );
      expect(prismaService.client.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateClientDto,
          user: { connect: { id: userId } },
          status: 'ACTIVE',
        },
        select: expect.any(Object),
      });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: mockClient.id },
        {
          expiresIn: '1h',
          subject: String(mockClient.id),
          issuer: 'email-verification',
          audience: 'clients',
        },
      );
      expect(emailService.sendEmailVerification).toHaveBeenCalledWith(
        mockClient.email,
        mockClient.name,
        'http://localhost:3000/api/v1/verify-email?token=mock-token',
      );
      expect(result).toEqual(mockClient);
    });

    it('should throw an error if validation fails', async () => {
      const userId = 1;
      const validationError = new ConflictException('Validation failed');
      jest
        .spyOn(validationService, 'validateClientFields')
        .mockRejectedValue(validationError);

      await expect(service.create(mockCreateClientDto, userId)).rejects.toThrow(
        validationError,
      );
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const clientId = 1;
      const expectedResult = {
        ...mockClient,
        ...mockUpdateClientDto,
        updatedAt: expect.any(Date),
      };

      const result = await service.update(clientId, mockUpdateClientDto);

      expect(validationService.validateClientFields).toHaveBeenCalledWith(
        mockUpdateClientDto,
      );
      expect(prismaService.client.update).toHaveBeenCalledWith({
        where: { id: clientId },
        data: {
          ...mockUpdateClientDto,
          updatedAt: expect.any(Date),
        },
        select: expect.any(Object),
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if validation fails during update', async () => {
      const clientId = 1;
      const validationError = new ConflictException('Validation failed');
      jest
        .spyOn(validationService, 'validateClientFields')
        .mockRejectedValue(validationError);

      await expect(
        service.update(clientId, mockUpdateClientDto),
      ).rejects.toThrow(validationError);
    });
  });

  describe('findAll', () => {
    it('should return paginated clients with no filters', async () => {
      const filter = { page: 1, limit: 10 };

      const result = await service.findAll(filter);

      expect(prismaService.client.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        select: expect.any(Object),
      });

      expect(prismaService.client.count).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual({
        data: [mockClient],
        meta: {
          total: 1,
          page: 1,
          lastPage: 1,
        },
      });
    });

    it('should apply filters when provided', async () => {
      const filter = {
        page: 1,
        limit: 10,
        name: 'Test',
        email: 'test',
        status: Status.ACTIVE,
        cpf: '123',
      };

      await service.findAll(filter);

      expect(prismaService.client.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: 'Test' },
          email: { contains: 'test' },
          status: Status.ACTIVE,
          cpf: { contains: '123' },
        },
        skip: 0,
        take: 10,
        select: expect.any(Object),
      });
    });
  });

  describe('findById', () => {
    it('should return a client by id', async () => {
      const clientId = 1;

      const result = await service.findById(clientId);

      expect(validationService.getClientOrFail).toHaveBeenCalledWith(
        clientId,
        expect.any(Object),
      );
      expect(result).toEqual(mockClient);
    });

    it('should throw an error if client is not found', async () => {
      const clientId = 999;
      const notFoundError = new NotFoundException('Client not found');
      jest
        .spyOn(validationService, 'getClientOrFail')
        .mockRejectedValue(notFoundError);

      await expect(service.findById(clientId)).rejects.toThrow(notFoundError);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a client', async () => {
      const clientId = 1;
      const deletedClient = {
        ...mockClient,
        status: Status.INACTIVE,
        updatedAt: expect.any(Date),
      };

      jest
        .spyOn(prismaService.client, 'update')
        .mockResolvedValue(deletedClient);

      const result = await service.softDelete(clientId);

      expect(validationService.getClientOrFail).toHaveBeenCalledWith(clientId);
      expect(validationService.ensureClientIsActive).toHaveBeenCalledWith(
        mockClient,
      );
      expect(prismaService.client.update).toHaveBeenCalledWith({
        where: { id: clientId },
        data: {
          status: 'INACTIVE',
          updatedAt: expect.any(Date),
        },
        select: expect.any(Object),
      });
      expect(result).toEqual(deletedClient);
    });

    it('should throw an error if client is not active', async () => {
      const clientId = 1;
      const inactiveError = new ConflictException('Client is not active');
      jest
        .spyOn(validationService, 'ensureClientIsActive')
        .mockRejectedValue(inactiveError);

      await expect(service.softDelete(clientId)).rejects.toThrow(inactiveError);
    });
  });
});
