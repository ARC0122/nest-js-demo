import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const queryRunner = this.userRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = this.userRepo.create(createUserDto);
      const savedUser = await queryRunner.manager.save(User, newUser);

      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error creating user: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepo.find();
    } catch (error) {
      throw new BadRequestException('Error fetching users: ' + error.message);
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepo.findOneBy({ UserID: id });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw new BadRequestException('Error fetching user: ' + error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const queryRunner = this.userRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateResult = await queryRunner.manager.update(
        User,
        { UserID: id },
        updateUserDto,
      );

      if (updateResult.affected === 0) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = await queryRunner.manager.findOne(User, {
        where: { UserID: id },
      });
      await queryRunner.commitTransaction();

      return updatedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error updating user: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    const queryRunner = this.userRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const deleteResult = await queryRunner.manager.softDelete(User, id);

      if (deleteResult.affected === 0) {
        throw new NotFoundException('User not found');
      }

      await queryRunner.commitTransaction();
      return { message: 'User deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error deleting user: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
