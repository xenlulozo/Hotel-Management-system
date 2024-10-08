import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppV1Module } from './v1/app.v1.module';
import { GoogleStrategy } from 'apps/users/src/auth/strategies/google.strategy';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [AppV1Module],
  controllers: [AppController],
  providers: [
    AppService,
    GoogleStrategy
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe
    // }
  ]
})
export class AppModule {}
