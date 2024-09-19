// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { CreateOwnerDto } from './dto/create-owner.dto';
// import { UpdateOwnerDto } from './dto/update-owner.dto';
// import { Owner } from 'src/entity/owner.entity';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { UserService } from 'src/user/user.service';

// @Injectable()
// export class OwnerService {
//   constructor(
//     @InjectRepository(Owner) private ownerRepo: Repository<Owner>,
//     private userService: UserService,
//   ) {}

//   async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
//     try {
//       const newOwner = new Owner();

//       Object.assign(newOwner, createOwnerDto);

//       if (createOwnerDto.UserID) {
//         const user = await this.userService.findOne(createOwnerDto.UserID);

//         if (!user) {
//           throw new BadRequestException('User not found');
//         }

//         newOwner.user = user;
//       }

//       return await this.ownerRepo.save(newOwner);
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   }

//   async findAll() {
//     const user = await this.ownerRepo.find({ relations: ['user'] });
//     return user;
//   }

//   async findOne(id: number): Promise<Owner> {
//     const owner = await this.ownerRepo.findOne({
//       where: { OwnerID: id },
//       relations: ['user'],
//     });

//     if (!owner) {
//       throw new NotFoundException('Owner Not Found');
//     }

//     return owner;
//   }

//   async update(id: number, updateOwnerDto: UpdateOwnerDto) {
//     try {
//       const updateResult = await this.ownerRepo.update(
//         { OwnerID: id },
//         updateOwnerDto,
//       );

//       if (updateResult.affected === 0) {
//         throw new Error('User not found');
//       }

//       return await this.ownerRepo.findOne({ where: { OwnerID: id } });
//     } catch (error) {
//       console.log(error);
//       throw new Error('Error updating user');
//     }
//   }

//   async delete(id: number) {
//     try {
//       const deleteResult = await this.ownerRepo.softDelete(id);

//       if (deleteResult.affected === 0) {
//         throw new Error('User not found');
//       }

//       return { message: 'User deleted successfully' };
//     } catch (error) {
//       throw new Error('Error deleting user');
//     }
//   }
// }

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Owner } from 'src/entity/owner.entity';
import { Repository, EntityManager, QueryRunner } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner) private ownerRepo: Repository<Owner>,
    private userService: UserService,
  ) {}

  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const queryRunner = this.ownerRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newOwner = new Owner();
      Object.assign(newOwner, createOwnerDto);

      if (createOwnerDto.UserID) {
        const user = await this.userService.findOne(createOwnerDto.UserID);

        if (!user) {
          throw new BadRequestException('User not found');
        }

        newOwner.user = user;
      }

      const savedOwner = await queryRunner.manager.save(newOwner);
      await queryRunner.commitTransaction();
      return savedOwner;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating owner:', error.message);
      throw new Error('Error creating owner');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Owner[]> {
    try {
      return await this.ownerRepo.find({ relations: ['user'] });
    } catch (error) {
      console.error('Error fetching owners:', error.message);
      throw new Error('Error fetching owners');
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
      console.error('Error fetching owner:', error.message);
      throw new Error('Error fetching owner');
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
      console.error('Error updating owner:', error.message);
      throw new Error('Error updating owner');
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
      console.error('Error deleting owner:', error.message);
      throw new Error('Error deleting owner');
    } finally {
      await queryRunner.release();
    }
  }
}
