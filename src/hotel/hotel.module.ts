import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { LogMiddleware } from '../logs/logs.middleware';

@Module({
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes(HotelController);
  }
}
