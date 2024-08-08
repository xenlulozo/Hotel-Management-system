import { Module } from '@nestjs/common';
import { GrpcModule } from './grpc/grpc.module';
import { BookingController } from './controller/booking.controller';
import { UserController } from './controller/user.controller';
import { PaymentController } from './controller/payment.controller';

@Module({
  imports: [GrpcModule],
  controllers: [UserController, BookingController, PaymentController]
})
export class AppV1Module {}
