import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcExceptionFilter } from 'apps/wrapper-controller/src/exception/grpc.exception';
import { BaseResponse } from 'apps/wrapper-controller/src/response/base.response.common';
import { UsersService } from './users.service';
@Controller('users')
@UseFilters(new GrpcExceptionFilter())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UserService', 'signUp')
  async signUp(body: Record<string, any>) {
    const response = new BaseResponse();
    response.setData(await this.usersService.signUp(body));
    return response;
  }
}
