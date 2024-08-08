import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class BaseResponseSwagger {
  @ApiResponseProperty({
    type: Number,
    example: 200
  })
  status: number;

  @ApiResponseProperty({
    type: String,
    example: 'Success'
  })
  message: string;

  @ApiResponseProperty({
    type: Number,
    example: null
  })
  data: any;
}
