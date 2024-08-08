import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppV1Module } from './v1/app.v1.module';
import { GoogleStrategy } from 'apps/users/src/auth/strategies/google.strategy';

@Module({
  imports: [AppV1Module],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy]
})
export class AppModule {}
