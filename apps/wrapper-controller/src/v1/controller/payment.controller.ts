import { Controller, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'apps/wrapper-controller/src/guards/user-guard.guard';
import { Response } from 'express';
import { ParamsSwagger } from '../../swagger/dto/query.dto.response';
import { BaseResponseSwagger } from '../../swagger/response/base-response.response';
import { GrpcClientService } from '../grpc/grpc.client.service';

@Controller({ path: 'payment' })
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly grpcClientService: GrpcClientService) {}

  @Post(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseResponseSwagger
  })
  @ApiOperation({ summary: 'Use to create order, will be redirected to create a successful order' })
  @UseGuards(UserGuard)
  async checkout(@Res() res: Response, @Param() params: ParamsSwagger) {
    const response = await this.grpcClientService.createOrder(params);
    if (response.status == HttpStatus.OK) res.redirect(response.data.checkout_url);
    else return res.status(HttpStatus.OK).send(response);
  }
}
