import { Controller, Res, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcExceptionFilter } from 'apps/wrapper-controller/src/exception/grpc.exception';
import { BaseResponse } from 'apps/wrapper-controller/src/response/base.response.common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
@UseFilters(new GrpcExceptionFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'signIn')
  async signIn(signInDto: Record<string, any>) {
    console.log('🚀 ~ AuthController ~ signIn ~ signInDto:', signInDto);
    const response = new BaseResponse();
    const data = await this.authService.signIn(signInDto.email, signInDto.password);
    response.setData(data);
    console.log('🚀 ~ AuthController ~ signIn ~ response:', response);
    return response;
  }

  @GrpcMethod('AuthService', 'validateToken')
  async validateToken(body: Record<string, any>) {
    console.log('🚀 ~ AuthController ~ validateToken ~ body:', body);
    const data = await this.authService.validateToken({
      accessToken: body.accessToken,
      refreshToken: body.refreshToken
    });

    const response = new BaseResponse();
    response.setData(data);
    return response;
  }

  @GrpcMethod('AuthService', 'googleLogin')
  async refreshToken(body: Record<string, any>) {
    console.log('🚀 ~ AuthController ~ refreshToken ~ body:', body);
    const data = await this.authService.signInWithGoogle(body.email, body.token);
    const response = new BaseResponse();
    response.setData(data);

    return response;
    // return this.authService.refreshToken(body.token);
  }
}
