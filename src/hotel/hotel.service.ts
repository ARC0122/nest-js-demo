import { Injectable } from '@nestjs/common';
import { HotelDto } from './dto/hotel.dto';

@Injectable()
export class HotelService {
  private hotels: HotelDto[] = [];

  constructor() {
    this.hotels = [
      {
        id: 1,
        name: 'Grand Hotel',
        location: 'New York',
        rating: 5,
      },
      {
        id: 2,
        name: 'Sunset Inn',
        location: 'Los Angeles',
        rating: 4,
      },
      {
        id: 3,
        name: 'Ocean Breeze Resort',
        location: 'Miami',
        rating: 5,
      },
      {
        id: 4,
        name: 'Mountain Retreat',
        location: 'Denver',
        rating: 4,
      },
    ];
  }

  findAll(): HotelDto[] {
    return this.hotels;
  }

  findOne(id: number): HotelDto {
    return this.hotels.find((hotel) => hotel.id === id);
  }

  create(createHotelDto: HotelDto) {
    this.hotels.push(createHotelDto);
  }

  update(id: number, updateHotelDto: Partial<HotelDto>) {
    const hotelIndex = this.hotels.findIndex((hotel) => hotel.id === id);
    if (hotelIndex !== -1) {
      this.hotels[hotelIndex] = {
        ...this.hotels[hotelIndex],
        ...updateHotelDto,
      };
    }
  }

  remove(id: number) {
    this.hotels = this.hotels.filter((hotel) => hotel.id !== id);
  }
}
