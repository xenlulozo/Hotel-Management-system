import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('🚀 ~ HttpExceptionFilter ~ exception:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse() as object as any;
    response.status(status == HttpStatus.UNAUTHORIZED ? HttpStatus.UNAUTHORIZED : HttpStatus.OK).json({
      statusCode: status,
      message: message.message,
      data: null
    });
  }
}
