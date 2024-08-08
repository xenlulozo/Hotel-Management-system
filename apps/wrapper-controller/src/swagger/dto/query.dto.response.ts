import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ParamsSwagger {
  @ApiProperty({
    example: 173903,
    description: `
    here we have list of booking id::  173903, 186176, 193523, 207875, 214061, 215676, 215684, 215691, 215693, 218177(amount = 0)
    
    Pick one of these to test

`
  })
  @IsNotEmpty()
  id: string;
}
