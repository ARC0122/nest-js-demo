import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Owner } from './entities/owner.entity';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner) private ownerRepo: Repository<Owner>,
    private userService: UsersService,
  ) {}

  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const queryRunner = this.ownerRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.userService.findOne(createOwnerDto.UserID);

      const newOwner = this.ownerRepo.create(createOwnerDto);
      const savedOwner = await queryRunner.manager.save(newOwner);

      await queryRunner.commitTransaction();
      return savedOwner;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error creating owner: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Owner[]> {
    try {
      return await this.ownerRepo.find({ relations: ['user'] });
    } catch (error) {
      throw new BadRequestException('Error fetching owners: ' + error.message);
    }
  }

  async findOne(id: number): Promise<Owner> {
    try {
      const owner = await this.ownerRepo.findOne({
        where: { OwnerID: id },
        relations: ['user'],
      });

      if (!owner) {
        throw new NotFoundException('Owner not found');
      }

      return owner;
    } catch (error) {
      throw new BadRequestException('Error fetching owner: ' + error.message);
    }
  }

  async update(id: number, updateOwnerDto: UpdateOwnerDto): Promise<Owner> {
    const queryRunner = this.ownerRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult = await queryRunner.manager.update(
        Owner,
        { OwnerID: id },
        updateOwnerDto,
      );

      if (updateResult.affected === 0) {
        throw new NotFoundException('Owner not found');
      }

      const updatedOwner = await queryRunner.manager.findOne(Owner, {
        where: { OwnerID: id },
        relations: ['user'],
      });

      await queryRunner.commitTransaction();
      return updatedOwner;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error updating owner: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    const queryRunner = this.ownerRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const deleteResult = await queryRunner.manager.softDelete(Owner, id);

      if (deleteResult.affected === 0) {
        throw new NotFoundException('Owner not found');
      }

      await queryRunner.commitTransaction();
      return { message: 'Owner deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error deleting owner: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
