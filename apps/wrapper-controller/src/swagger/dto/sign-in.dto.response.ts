import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInSwagger {
  @ApiProperty({
    example: 'onehardship@gmail.com',
    description: `
    Email
`
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 1,
    description: `
    Password
`
  })
  @IsNotEmpty()
  password: string;
}

export class SignInGoogleSwagger {
  @ApiProperty({
    example: 'onehardship@gmail.com',
    description: `
    Email
`
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'missing',
    description: `
    access_token from google
`
  })
  @IsNotEmpty()
  token: string;
}
