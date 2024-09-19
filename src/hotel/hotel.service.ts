import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel } from 'src/entity/hotel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnerService } from 'src/owner/owner.service';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel) private hotelRepo: Repository<Hotel>,
    private ownerService: OwnerService,
  ) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const queryRunner = this.hotelRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (createHotelDto.OwnerID) {
        await this.ownerService.findOne(createHotelDto.OwnerID);
      }

      const newHotel = this.hotelRepo.create(createHotelDto);
      const savedHotel = await queryRunner.manager.save(newHotel);

      await queryRunner.commitTransaction();
      return savedHotel;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error creating hotel: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      return await this.hotelRepo.find({ relations: ['owner'] });
    } catch (error) {
      throw new BadRequestException('Error fetching hotels: ' + error.message);
    }
  }

  async findOne(id: number): Promise<Hotel> {
    try {
      const hotel = await this.hotelRepo.findOne({
        where: { HotelID: id },
        relations: ['owner'],
      });
      if (!hotel) {
        throw new NotFoundException('Hotel not found');
      }
      return hotel;
    } catch (error) {
      throw new BadRequestException('Error fetching hotel: ' + error.message);
    }
  }

  async update(id: number, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    const queryRunner = this.hotelRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hotel = await queryRunner.manager.findOne(Hotel, {
        where: { HotelID: id },
      });
      if (!hotel) {
        throw new NotFoundException('Hotel not found');
      }

      if (updateHotelDto.OwnerID) {
        const owner = await this.ownerService.findOne(updateHotelDto.OwnerID);

        if (!owner) {
          throw new BadRequestException('Owner not found');
        }
      }

      const updateResult = await queryRunner.manager.update(
        Hotel,
        { HotelID: id },
        updateHotelDto,
      );

      if (updateResult.affected === 0) {
        throw new NotFoundException('Hotel not found for update');
      }

      const updatedHotel = await queryRunner.manager.findOne(Hotel, {
        where: { HotelID: id },
        relations: ['owner'],
      });

      await queryRunner.commitTransaction();
      return updatedHotel;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error updating hotel: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    const queryRunner = this.hotelRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const deleteResult = await queryRunner.manager.softDelete(Hotel, id);

      if (deleteResult.affected === 0) {
        throw new NotFoundException('Hotel not found');
      }

      await queryRunner.commitTransaction();
      return { message: 'Hotel deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error deleting hotel: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
