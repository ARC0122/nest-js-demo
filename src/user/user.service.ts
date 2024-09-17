import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  findAll() {
    const user = this.userRepo.find();
    return user;
  }

  findOne(id: number) {
    const user = this.userRepo.findOneBy({ UserID: id });
    if (!user) throw new NotFoundException('User Not found ');

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      console.log(createUserDto);
      const newUser = await this.userRepo.create(createUserDto);
      return this.userRepo.save(newUser);
    } catch (error) {
      console.log(error);
    }
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
