import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AUTH_SERVICE_NAME, AuthServiceClient, GoogleLoginDTO, LoginDTO, ValidateTokenDTO } from './protos/user-auth';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SignUpDTO, USER_SERVICE_NAME, UserServiceClient } from './protos/user';
import { BOOKING_SERVICE_NAME, BookingServiceClient, DetailDTO } from './protos/booking';
import { CreateorderDTO, PAYMENT_SERVICE_NAME, PaymentServiceClient } from './protos/payment';

@Injectable()
export class GrpcClientService implements OnModuleInit {
  private authClient: AuthServiceClient;
  private userClient: UserServiceClient;
  private bookingClient: BookingServiceClient;
  private paymentClient: PaymentServiceClient;

  onModuleInit() {
    this.authClient = this.gRPCAuthClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    this.userClient = this.gRPCUserClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    this.bookingClient = this.gRPCbookingClient.getService<BookingServiceClient>(BOOKING_SERVICE_NAME);
    this.paymentClient = this.gRPCPaymentClient.getService<PaymentServiceClient>(PAYMENT_SERVICE_NAME);
  }

  constructor(
    @Inject('USER.GRPC')
    private readonly gRPCAuthClient: ClientGrpc,
    @Inject('USER.GRPC')
    private readonly gRPCUserClient: ClientGrpc,
    @Inject('BOOKING.GRPC')
    private readonly gRPCbookingClient: ClientGrpc,
    @Inject('PAYMENT.GRPC')
    private readonly gRPCPaymentClient: ClientGrpc
  ) {}
  //USER
  async signIn(request: LoginDTO) {
    return await lastValueFrom(this.authClient.signIn(request));
  }

  async signInWithGoogle(request: GoogleLoginDTO) {
    return await lastValueFrom(this.authClient.googleLogin(request));
  }

  async validateToken(request: ValidateTokenDTO) {
    return await lastValueFrom(this.authClient.validateToken(request));
  }

  async signUp(request: SignUpDTO) {
    return await lastValueFrom(this.userClient.signUp(request));
  }

  // BOOKING

  async detailBooking(request: DetailDTO) {
    return await lastValueFrom(this.bookingClient.getBooking(request));
  }

  // PAYMENT

  async createOrder(request: CreateorderDTO) {
    return await lastValueFrom(this.paymentClient.createOrder(request));
  }
}
