import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Pindrop API')
    .setDescription('Pindrop application REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-spec', app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.setBaseViewsDir(join(__dirname, '../..', 'templates'));
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
