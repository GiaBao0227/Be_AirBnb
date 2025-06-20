// src/main.ts

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './common/constant/app.constant';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'body-parser'; // <-- BƯỚC 1: IMPORT

import { ResponseSuccessInterceptor } from './common/interceptor/response-success.interceptor';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { ProtectGuard } from './modules/auth/protect/protect.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // ✨ BƯỚC 2: THÊM CẤU HÌNH BODY PARSER ✨
  // Đặt nó ở gần đầu để nó chạy trước các xử lý khác
  app.use(json({ limit: '50mb' })); // Tăng giới hạn payload JSON lên 50MB
  
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useStaticAssets(process.cwd() + '/public');

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new ProtectGuard(reflector));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseSuccessInterceptor());
  
  const config = new DocumentBuilder()
    .setTitle('AirBnb API')
    .setDescription('Tài liệu API cho dự án AirBnb Clone')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' }, 'AccessToken')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  
  const port = PORT || 3069;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Documentations running on: http://localhost:${port}/api-docs`);
}
bootstrap();