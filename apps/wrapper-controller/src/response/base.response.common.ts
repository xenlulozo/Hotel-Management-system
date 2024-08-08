import { HttpStatus } from '@nestjs/common';

export class BaseResponse {
  private status: HttpStatus;
  private message: string;
  private data: object;

  constructor(status?: number, message?: string, data?: object) {
    this.status = status ? +status : HttpStatus.OK;
    this.message = message ? message : 'SUCCESS';
    this.data = data ? data : null;
  }

  public setStatus(status: HttpStatus): void {
    this.status = status;
  }

  public setMessage(message: string): void {
    this.message = message;
  }

  public setData(data: any): void {
    this.data = data;
  }
}
