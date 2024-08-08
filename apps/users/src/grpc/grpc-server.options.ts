import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { config } from 'dotenv';

config();
export const grpcServerOptions: MicroserviceOptions = {
  transport: Transport.GRPC,
  options: {
    url: `0.0.0.0:${process.env.GRPC_SERVICE_USER_PORT}`,
    package: ['vn.grpc.nodejs.user.service', 'vn.grpc.nodejs.user_auth.service'],
    protoPath: [join(__dirname, './grpc/protos/user.proto'), join(__dirname, './grpc/protos/user-auth.proto')],
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    }
  }
};
