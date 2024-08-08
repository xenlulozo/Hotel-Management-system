import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { config } from 'dotenv';

config();

export const grpcServerOptions: MicroserviceOptions = {
  transport: Transport.GRPC,
  options: {
    url: `0.0.0.0:${process.env.GRPC_SERVICE_PAYMENT_PORT}`,
    package: ['vn.grpc.nodejs.payment.service'],
    protoPath: [join(__dirname, './grpc/protos/payment.proto')],
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    }
  }
};
