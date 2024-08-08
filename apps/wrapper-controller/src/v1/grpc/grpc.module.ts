import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcClientService } from './grpc.client.service';
import { VN_GRPC_NODEJS_USER_SERVICE_PACKAGE_NAME } from './protos/user';
import { AUTH_SERVICE_NAME, VN_GRPC_NODEJS_USER_AUTH_SERVICE_PACKAGE_NAME } from './protos/user-auth';
import { VN_GRPC_NODEJS_BOOKING_SERVICE_PACKAGE_NAME } from './protos/booking';
import { config } from 'dotenv';
import { VN_GRPC_NODEJS_PAYMENT_SERVICE_PACKAGE_NAME } from './protos/payment';

config();

const retryOptions = {
  max_retries: 3, // Set the maximum number of retries
  initial_backoff_ms: 1000, // Initial backoff time in milliseconds
  max_backoff_ms: 5000, // Maximum backoff time in milliseconds
  backoff_multiplier: 1.5, // Backoff multiplier
  retryable_status_codes: [14] // Status codes to retry
};

// @Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER.GRPC',
        transport: Transport.GRPC,
        options: {
          package: [VN_GRPC_NODEJS_USER_AUTH_SERVICE_PACKAGE_NAME, VN_GRPC_NODEJS_USER_SERVICE_PACKAGE_NAME],
          protoPath: [join(__dirname, './v1/grpc/protos/user-auth.proto'), join(__dirname, './v1/grpc/protos/user.proto')],
          url: `localhost:${process.env.GRPC_SERVICE_USER_PORT}`,
          loader: {
            keepCase: true
          },
          keepalive: {
            keepaliveTimeMs: 60000,
            keepaliveTimeoutMs: 20000,
            keepalivePermitWithoutCalls: 0,
            ...(retryOptions && { retry: retryOptions })
          },
          channelOptions: {
            'grpc.max_receive_message_length': 1024 * 1024 * 1024,
            'grpc.max_send_message_length': 1024 * 1024 * 100,
            grpcOptions: {
              'grpc.http2.max_frame_size': 1024 * 1024 * 10
            }
          }
        }
      }
    ]),
    ClientsModule.register([
      {
        name: 'BOOKING.GRPC',
        transport: Transport.GRPC,
        options: {
          package: [VN_GRPC_NODEJS_BOOKING_SERVICE_PACKAGE_NAME],
          protoPath: [join(__dirname, './v1/grpc/protos/booking.proto')],
          url: `localhost:${process.env.GRPC_SERVICE_BOOKING_PORT}`,
          loader: {
            keepCase: true
          },
          keepalive: {
            keepaliveTimeMs: 60000,
            keepaliveTimeoutMs: 20000,
            keepalivePermitWithoutCalls: 0,
            ...(retryOptions && { retry: retryOptions })
          },
          channelOptions: {
            'grpc.max_receive_message_length': 1024 * 1024 * 1024,
            'grpc.max_send_message_length': 1024 * 1024 * 100,
            grpcOptions: {
              'grpc.http2.max_frame_size': 1024 * 1024 * 10
            }
          }
        }
      }
    ]),
    ClientsModule.register([
      {
        name: 'PAYMENT.GRPC',
        transport: Transport.GRPC,
        options: {
          package: [VN_GRPC_NODEJS_PAYMENT_SERVICE_PACKAGE_NAME],
          protoPath: [join(__dirname, './v1/grpc/protos/payment.proto')],
          url: `localhost:${process.env.GRPC_SERVICE_PAYMENT_PORT}`,
          loader: {
            keepCase: true
          },
          keepalive: {
            keepaliveTimeMs: 60000,
            keepaliveTimeoutMs: 20000,
            keepalivePermitWithoutCalls: 0,
            ...(retryOptions && { retry: retryOptions })
          },
          channelOptions: {
            'grpc.max_receive_message_length': 1024 * 1024 * 1024,
            'grpc.max_send_message_length': 1024 * 1024 * 100,
            grpcOptions: {
              'grpc.http2.max_frame_size': 1024 * 1024 * 10
            }
          }
        }
      }
    ])
  ],
  providers: [GrpcClientService],
  exports: [ClientsModule, GrpcClientService]
})
export class GrpcModule {}
