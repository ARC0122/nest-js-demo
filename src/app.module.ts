import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { OwnerModule } from './owner/owner.module';
import { HotelModule } from './hotel/hotel.module';
import { Owner } from './entity/owner.entity';
import { Hotel } from './entity/hotel.entity';
import { LogMiddleware } from './middelware/logs.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptor/transform.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',

      database: 'nesttestmigrate',
      entities: [User, Owner, Hotel],
      synchronize: false,
    }),
    UserModule,
    AuthModule,
    OwnerModule,
    HotelModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
