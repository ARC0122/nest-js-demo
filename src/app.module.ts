import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LogMiddleware } from './middelware/logs.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { UsersModule } from './users/users.module';
import { OwnersModule } from './owners/owners.module';
import { HotelsModule } from './hotels/hotels.module';
import { User } from './users/entities/user.entity';
import { Hotel } from './hotels/entities/hotel.entity';
import { Owner } from './owners/entities/owner.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nesttest',
      entities: [User, Owner, Hotel],
      synchronize: false,
    }),
    AuthModule,
    UsersModule,
    OwnersModule,
    HotelsModule,
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
