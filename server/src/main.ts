import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { logger } from './common/logger.middleware';
import { TimeoutInterceptor } from './common/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(logger);
  app.useGlobalInterceptors(new TimeoutInterceptor());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет свойства, которых нет в DTO
      forbidNonWhitelisted: true, // Выбрасывает ошибку, если есть лишние свойства
      transform: true, // Автоматически преобразует типы
      transformOptions: {
        enableImplicitConversion: true, // Включает неявное преобразование типов
      },
    }),
  );

  // Swagger configuration
  // http://localhost:3000/api#/
  const config = new DocumentBuilder()
    .setTitle('Investment Bag API')
    .setDescription('API для управления инвестиционным портфелем')
    .setVersion('1.0')
    .addTag('users', 'Операции с пользователями')
    .addTag('portfolio', 'Операции с портфелем')
    .addTag('favorites', 'Избранные инструменты')
    .addTag('T-Invest', 'Работа с T-Invest API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  

  await app.listen(3000);
  console.log('Server is running on http://localhost:3000');
}

bootstrap();