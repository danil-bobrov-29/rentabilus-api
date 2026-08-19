import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = app.get(ConfigService);
  const port = config.getOrThrow<string>('HTTP_PORT');
  const host = config.getOrThrow<string>('HTTP_HOST');
  const globalPrefix = config.getOrThrow<string>('GLOBAL_PREFIX');

  app.setGlobalPrefix(globalPrefix ?? '/api');

  const configSwagger = new DocumentBuilder()
    .setTitle('Rentabilus-api')
    .setDescription('Описание документации rentabilus-api')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Введите JWT access-токен',
      },
      'access-token',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, documentFactory);

  const logger = new Logger();

  logger.log(`🚀 Start service ${host}`);
  logger.log(`📚 Swagger service ${host}/docs`);
  await app.listen(port);
}
void bootstrap();
