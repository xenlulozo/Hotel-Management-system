import { Controller, Get, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { UserGuard } from 'apps/wrapper-controller/src/guards/user-guard.guard';
import { Response } from 'express';
import { GrpcClientService } from '../grpc/grpc.client.service';
import { BaseResponse, DetailDTO } from '../grpc/protos/booking';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseSwagger } from '../../swagger/response/detail-booking.response';
import { ParamsSwagger } from '../../swagger/dto/query.dto.response';

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
  async signUp(@Res() res: Response, @Param() params: ParamsSwagger) {
    console.log('🚀 ~ BookingController ~ signUp ~ params:', params);

    const response: BaseResponse = await this.grpcClientService.detailBooking(params);

    return res.status(HttpStatus.OK).send(response);
  }
}
