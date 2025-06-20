import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { PORT } from './common/constant/app.constant';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { ResponseSuccessInterceptor } from './common/interceptor/response-success.interceptor';
import { ProtectGuard } from './modules/auth/protect/protect.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'images'), {
    prefix: '/images',
  });

  // GLOBAL
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new ProtectGuard(reflector));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseSuccessInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'AccessToken',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(PORT ?? 3000);
}
bootstrap();
