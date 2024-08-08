import { Controller, HttpStatus, UseFilters } from '@nestjs/common';

import { GrpcMethod } from '@nestjs/microservices';
import { BaseResponse } from 'apps/wrapper-controller/src/response/base.response.common';
import { GrpcExceptionFilter } from 'apps/wrapper-controller/src/exception/grpc.exception';
import { PaymentService } from './payment.service';

@Controller('payment')
@UseFilters(new GrpcExceptionFilter())
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @GrpcMethod('PaymentService', 'createOrder')
  async createOrder(req: { id: string }) {
    console.log('🚀 ~ PaymentController ~ getBooking ~ req:', req);
    const result = await this.paymentService.createOrder(req.id);
    console.log('🚀 ~ PaymentController ~ createOrder ~ result:', result);
    const response = new BaseResponse();

    response.setStatus(result.isSuccess ? HttpStatus.OK : HttpStatus.BAD_REQUEST);

    response.setData({ checkout_url: result.checkout_url });
    response.setMessage(result.message);
    return response;
  }

  @GrpcMethod('PaymentService', 'checkOrder')
  async checkOrder(req: { id: string }) {
    // console.log('🚀 ~ PaymentController ~ getBooking ~ req:', req);
    // await this.paymentService.createOrder(req.id);
    // const response = new BaseResponse();
    // return response;
  }
}
