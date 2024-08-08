import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { GrpcClientService } from '../v1/grpc/grpc.client.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly grpcClientService: GrpcClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    // const authorization = request.headers.authorization;
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!(accessToken && refreshToken)) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Token Incorrect!'
      });
    }

    const response = await this.grpcClientService.validateToken({ refreshToken, accessToken });
    if (response.status == HttpStatus.UNAUTHORIZED)
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'UNAUTHORIZED'
      });
    console.log('🚀 ~ UserGuard ~ canActivate ~ response:', response);

    if (response.data.isRefresh) {
      console.log('REFRESH TOKEN');

      res.cookie('access_token', response.data.accessToken, { httpOnly: true });
      res.cookie('refresh_token', response.data.refreshToken, { httpOnly: true });
    }

    return true;
  }
}
