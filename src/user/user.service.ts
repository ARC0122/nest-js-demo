import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userRepo.create(createUserDto);
      return this.userRepo.save(newUser);
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    const user = await this.userRepo.find();
    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ UserID: id });
    if (!user) throw new NotFoundException('User Not found ');

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updateResult = await this.userRepo.update(
        { UserID: id },
        updateUserDto,
      );

      if (updateResult.affected === 0) {
        throw new Error('User not found');
      }

      return await this.userRepo.findOne({ where: { UserID: id } });
    } catch (error) {
      console.log(error);
      throw new Error('Error updating user');
    }
  }

  async delete(id: number) {
    try {
      const deleteResult = await this.userRepo.softDelete(id);

      if (deleteResult.affected === 0) {
        throw new Error('User not found');
      }

      return { message: 'User deleted successfully' };
    } catch (error) {
      console.log(error);
      throw new Error('Error deleting user');
    }
  }
}
