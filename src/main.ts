import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogMiddleware } from './middelware/logs.middleware';
import { TransformInterceptor } from './interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  app.useGlobalInterceptors(new TransformInterceptor());

  app.use(LogMiddleware);
}
bootstrap();
