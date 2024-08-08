import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { FakeModule } from './simulate 3rd API/module';

@Module({
  imports: [FakeModule, BookingModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
