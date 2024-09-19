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
    try {
      const newHotel = new Hotel();

      Object.assign(newHotel, createHotelDto);

      if (createHotelDto.OwnerID) {
        const owner = await this.ownerService.findOne(createHotelDto.OwnerID);

        if (!owner) {
          throw new BadRequestException('Owner not found');
        }

        newHotel.owner = owner;
      }

      return await this.hotelRepo.save(newHotel);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll() {
    const user = await this.hotelRepo.find({ relations: ['owner'] });
    return user;
  }

  async findOne(id: number): Promise<Hotel> {
    const user = await this.hotelRepo.findOne({
      where: { HotelID: id },
      relations: ['owner'],
    });
    if (!user) throw new NotFoundException('Hotel Not found ');

    return user;
  }

  async update(id: number, updateHotelDto: UpdateHotelDto) {
    try {
      const updateResult = await this.hotelRepo.update(
        { HotelID: id },
        updateHotelDto,
      );

      if (updateResult.affected === 0) {
        throw new Error('User not found');
      }

      return await this.hotelRepo.findOne({ where: { HotelID: id } });
    } catch (error) {
      console.log(error);
      throw new Error('Error updating user');
    }
  }

  async delete(id: number) {
    try {
      const deleteResult = await this.hotelRepo.softDelete(id);

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
