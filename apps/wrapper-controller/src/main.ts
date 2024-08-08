import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder().setTitle('').setDescription('').setVersion('2.19').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());

  await app.listen(process.env.SERVICE_WRAPPER_PORT);
  console.log('APP RUNNING IN PORT :', process.env.SERVICE_WRAPPER_PORT);
}
bootstrap();
