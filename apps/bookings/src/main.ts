import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { grpcServerOptions } from './grpc/grpc-server.options';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(grpcServerOptions);
  await app.startAllMicroservices();

  await app.listen(process.env.SERVICE_BOOKING_PORT);
  console.log('APP RUNNING IN PORT :', process.env.SERVICE_BOOKING_PORT);
}
bootstrap();
