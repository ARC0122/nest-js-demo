import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { Hotel } from 'src/entity/hotel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerModule } from 'src/owner/owner.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel]), OwnerModule],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
