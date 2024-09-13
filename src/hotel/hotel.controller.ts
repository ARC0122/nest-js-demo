import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelDto } from './dto/hotel.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  findAll() {
    return this.hotelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.hotelService.findOne(Number(id));
  }

  @Post()
  create(@Body() createHotelDto: HotelDto) {
    this.hotelService.create(createHotelDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateHotelDto: Partial<HotelDto>) {
    this.hotelService.update(Number(id), updateHotelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.hotelService.remove(Number(id));
  }
}
