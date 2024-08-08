import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BOOKING_SERVICE_NAME, BookingServiceClient, DetailDTO } from './booking';

@Injectable()
export class GrpcClientService implements OnModuleInit {
  private bookingClient: BookingServiceClient;

  onModuleInit() {
    this.bookingClient = this.gRPCbookingClient.getService<BookingServiceClient>(BOOKING_SERVICE_NAME);
  }

  constructor(
    @Inject('BOOKING.GRPC')
    private readonly gRPCbookingClient: ClientGrpc
  ) {}

  // BOOKING

  async detailBooking(request: DetailDTO) {
    return await lastValueFrom(this.bookingClient.getBooking(request));
  }

  //   import { createHash } from 'crypto';

  // const merchant_site_code = 7;
  // const version = "1.0";
  // const order_code = "215693";
  // const order_description = "order_description";
  // const amount = 1350000;
  // const currency = "VND";
  // const buyer_fullname = "buyer_fullname";
  // const buyer_email = "onehardship@gmail.com";
  // const buyer_mobile = "0984331282";
  // const buyer_address = "go vap";
  // const return_url = "localhost:3000/payment-succes";
  // const cancel_url = "localhost:3000/payment-fail";
  // const notify_url = "";
  // const language = "vi";
  // const merchant_passcode = "123456789";

  // const token = "177160-CO0A02D82C00"
  // const sender_fee = ""
  // const receiver_fee= ""
  // const payment_method_code= ""
  // const payment_method_name= ""
  // const dataToHash = `${merchant_site_code}|${order_code}|${order_description}|${amount}|${currency}|` +
  //                    `${buyer_fullname}|${buyer_email}|${buyer_mobile}|${buyer_address}|${return_url}|` +
  //                    `${cancel_url}|${notify_url}|${language}|${merchant_passcode}`;

  // const checkOrder = `${token}|${version}|${order_code}|${order_description}|${amount}|${sender_fee}|${receiver_fee}|` +
  //                    `${currency}|${return_url}|` +
  //                    `${cancel_url}|${notify_url}|${1}|${payment_method_code}|${payment_method_name}|${merchant_passcode}`;
  // // console.log("Data to hash:", dataToHash);
  // console.log("checkOrder:", checkOrder);

  // // const md5Hash = createHash('md5').update(dataToHash, 'utf8').digest('hex');
  // const md5Hash = createHash('md5').update(checkOrder, 'utf8').digest('hex');

  // // console.log("MD5 Hash:", md5Hash);
  // console.log("MD5 checkOrder:", md5Hash);
}
