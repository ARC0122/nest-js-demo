import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Owner } from 'src/entity/owner.entity';
import { UserService } from 'src/user/user.service';
import { Repository, UpdateResult } from 'typeorm';
import { OwnerService } from './owner.service';

// Create a mock for UpdateResult
const mockUpdateResult: UpdateResult = {
  raw: {},
  affected: 1,
  generatedMaps: [],
};

describe('OwnerService', () => {
  let service: OwnerService;
  let repository: Repository<Owner>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnerService,
        {
          provide: getRepositoryToken(Owner),
          useValue: {
            create: jest.fn().mockImplementation((dto) => ({ ...dto })),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({}), // Mock user service methods
          },
        },
      ],
    }).compile();

    service = module.get<OwnerService>(OwnerService);
    repository = module.get<Repository<Owner>>(getRepositoryToken(Owner));
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an owner and commit the transaction', async () => {
      const dto = { UserID: 1 /* other fields */ };
      const newOwner = new Owner();
      Object.assign(newOwner, dto);

      jest.spyOn(userService, 'findOne').mockResolvedValue(newOwner as any);
      jest.spyOn(repository, 'save').mockResolvedValue(newOwner);

      await expect(service.create(dto)).resolves.toEqual(newOwner);
    });

    it('should rollback transaction if user is not found', async () => {
      const dto = { UserID: 999 /* other fields */ };

      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an owner and commit the transaction', async () => {
      const dto = {
        /* update fields */
      };
      const existingOwner = new Owner();
      existingOwner.OwnerID = 1;

      jest.spyOn(repository, 'update').mockResolvedValue(mockUpdateResult);
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingOwner);

      await expect(service.update(1, dto)).resolves.toEqual(existingOwner);
    });

    it('should rollback transaction if update fails', async () => {
      const dto = {
        /* update fields */
      };

      const failedUpdateResult: UpdateResult = {
        raw: {},
        affected: 0,
        generatedMaps: [],
      };

      jest.spyOn(repository, 'update').mockResolvedValue(failedUpdateResult);

      await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an owner and commit the transaction', async () => {
      jest
        .spyOn(repository, 'softDelete')
        .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      await expect(service.delete(1)).resolves.toEqual({
        message: 'Owner deleted successfully',
      });
    });

    it('should rollback transaction if delete fails', async () => {
      jest
        .spyOn(repository, 'softDelete')
        .mockResolvedValue({ affected: 0, raw: {}, generatedMaps: [] });

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
