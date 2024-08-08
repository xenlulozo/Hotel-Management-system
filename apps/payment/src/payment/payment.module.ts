import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { GrpcClientModule } from '../grpc/client/grpc-client.module';

@Module({
  imports: [GrpcClientModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
