import { Controller, UseFilters } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Service } from '../simulate 3rd API/service';
import { GrpcMethod } from '@nestjs/microservices';
import { BaseResponse } from 'apps/wrapper-controller/src/response/base.response.common';
import { GrpcExceptionFilter } from 'apps/wrapper-controller/src/exception/grpc.exception';

@Controller('booking')
@UseFilters(new GrpcExceptionFilter())
export class BookingController {
  constructor(private readonly service: Service) {}

  @GrpcMethod('BookingService', 'getBooking')
  async getBooking(req: { id: string }) {
    console.log('🚀 ~ BookingController ~ getBooking ~ req:', req);
    const response = new BaseResponse();
    response.setData(await this.service.getBooking(req.id));
    return response;
  }
}
