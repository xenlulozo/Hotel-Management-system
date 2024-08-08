import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from 'apps/wrapper-controller/src/exception/http.exception';
import { MicroserviceOptions } from '@nestjs/microservices';
import { grpcServerOptions } from './grpc/grpc-server.options';
import { config } from 'dotenv';

config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // app.useGlobalFilters(new HttpExceptionFilter());

  app.connectMicroservice<MicroserviceOptions>(grpcServerOptions);
  await app.startAllMicroservices();

  await app.listen(process.env.SERVICE_USER_PORT);

  console.log('APP RUNNING IN PORT :', process.env.SERVICE_USER_PORT);
}
bootstrap();
