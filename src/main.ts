import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.getOrThrow<string>('HTTP_PORT');
  const host = config.getOrThrow<string>('HTTP_HOST');
  const globalPrefix = config.getOrThrow<string>('GLOBAL_PREFIX');

  app.setGlobalPrefix(globalPrefix ?? '/api');

  const configSwagger = new DocumentBuilder()
    .setTitle('Rentabilus-api')
    .setDescription('Описание документации rentabilus-api')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, documentFactory);

  const logger = new Logger();

  logger.log(`🚀 Start service ${host}`);
  logger.log(`📚 Swagger service ${host}/docs`);
  await app.listen(port);
}
void bootstrap();
