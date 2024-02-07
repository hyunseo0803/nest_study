import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('WithNetWorks NestJSSwagger')
    .setDescription('The WithNetWorks API description')
    .setVersion('1.0')
    .addTag('NestJS')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('choiSwagger', app, document);

  const resizeDir = fs.existsSync('./resizedUpload');
  const uploadDir = fs.existsSync('./upload');
  const pdfDir = fs.existsSync('./pdf');
  if (!pdfDir) fs.mkdirSync('./pdf');
  if (!resizeDir) fs.mkdirSync('./resizedUpload');
  if (!uploadDir) fs.mkdirSync('./upload');

  await app.listen(5007);
}
bootstrap();
