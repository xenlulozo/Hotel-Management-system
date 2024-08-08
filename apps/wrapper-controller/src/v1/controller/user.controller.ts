import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { TokenData } from 'apps/users/src/common/interface/toeken.interface';
import { Response, Request } from 'express';
import { BaseResponse } from '../../response/base.response.common';
import { GrpcClientService } from '../grpc/grpc.client.service';
import { SignUpDTO } from '../grpc/protos/user';
import { GoogleLoginDTO, LoginDTO } from '../grpc/protos/user-auth';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInGoogleSwagger, SignInSwagger } from '../../swagger/dto/sign-in.dto.response';
import { BaseResponseSwagger } from '../../swagger/response/base-response.response';

@Controller({ path: 'user' })
@ApiTags('Users')
export class UserController {
  constructor(private readonly grpcClientService: GrpcClientService) {}

  @Post('/sign-up')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseResponseSwagger
  })
  @ApiOperation({ summary: 'use demo create basic_token and jwt ' })
  async signUp(@Res() res: Response, @Body() body: SignUpDTO) {
    console.log('🚀 ~ UserController ~ signUp ~ body:', body);

    const data = await this.grpcClientService.signUp(body);

    return res.status(data.status).send(data);
  }

  @Get('/google')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseResponseSwagger
  })
  @ApiOperation({ summary: 'Login by google, after login you can call booking api, pay with token in cookie' })
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @ApiOperation({
    summary:
      'redirect to client here just demo, client will have an email, access_token from google and use that email, access_token to call the sign-in-google api'
  })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    // redirect to client here just demo
    if (!req.user) {
      return 'No user from google';

      //sign up
    }

    return {
      message: 'User information from google',
      user: req.user
    };
  }

  @Post('/sign-in')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseResponseSwagger
  })
  @ApiOperation({ summary: 'Login by email, password, after login you can call booking api, pay with token in cookie' })
  @ApiBody({ type: SignInSwagger })
  async signIn(@Res() res: Response, @Body() body: SignUpDTO) {
    console.log('🚀 ~ UserController ~ signUp ~ body:', body);

    const data = await this.grpcClientService.signIn(body);
    data.status == HttpStatus.OK && this.setTokenCookie(res, data.data);

    return res.status(data.status).send(data);
  }

  @Post('/sign-in-google')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseResponseSwagger
  })
  @ApiOperation({ summary: 'Login by email, password, after login you can call booking api, pay with token in cookie' })
  @ApiBody({ type: SignInGoogleSwagger })
  async signInWithGoogle(@Res() res: Response, @Body() body: GoogleLoginDTO) {
    // user email, accessToken is obtained after redirected
    console.log('🚀 ~ UserController ~ signUp ~ body:', body);

    const data = await this.grpcClientService.signInWithGoogle(body);
    data.status == HttpStatus.OK && this.setTokenCookie(res, data.data);

    return res.status(data.status).send(data);
  }

  private setTokenCookie(res: Response, data: TokenData) {
    res.cookie('access_token', data.accessToken, { httpOnly: true });
    res.cookie('refresh_token', data.refreshToken, { httpOnly: true });
  }
}
