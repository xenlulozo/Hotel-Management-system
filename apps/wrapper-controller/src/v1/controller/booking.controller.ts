import { Controller, Get, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'apps/wrapper-controller/src/guards/user-guard.guard';
import { Response } from 'express';
import { ParamsSwagger } from '../../swagger/dto/query.dto.response';
import { ResponseSwagger } from '../../swagger/response/detail-booking.response';
import { GrpcClientService } from '../grpc/grpc.client.service';
import { BaseResponse } from '../grpc/protos/booking';

@Controller({ path: 'booking' })
@ApiTags('Bookings')
export class BookingController {
  constructor(private readonly grpcClientService: GrpcClientService) {}

  @Get(':id')
  @UseGuards(UserGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseSwagger
  })
  @ApiOperation({ summary: 'Get detail booking.' })
  async detailBooking(@Res() res: Response, @Param() params: ParamsSwagger) {
    console.log('🚀 ~ BookingController ~ signUp ~ params:', params);

    const response: BaseResponse = await this.grpcClientService.detailBooking(params);

    return res.status(HttpStatus.OK).send(response);
  }
}
