import { ApiProperty } from '@nestjs/swagger';

class RateAmount {
  @ApiProperty({ example: 100.0, description: 'The amount for the rate' })
  amount: number;

  @ApiProperty({ example: 'USD', description: 'The currency of the rate amount' })
  currency: string;
}
export class BookingResponse {
  @ApiProperty({ example: '123456', description: 'The confirmation number of the booking' })
  confirmation_no: string;

  @ApiProperty({ example: '78910', description: 'The reservation name ID' })
  resv_name_id: string;

  @ApiProperty({ type: RateAmount, required: false, description: 'Rate amount details' })
  rateamount: RateAmount;

  @ApiProperty({ example: 'Deluxe', description: 'Type of the room' })
  roomtype: string;

  @ApiProperty({ example: 'ABC123', description: 'The rate code for the booking' })
  ratecode: string;

  @ApiProperty({ example: '2023-08-01', description: 'Arrival date' })
  arrival: string;

  @ApiProperty({ example: '2023-08-07', description: 'Departure date' })
  departure: string;

  @ApiProperty({ example: 500.0, description: 'Booking balance' })
  booking_balance: number;

  @ApiProperty({ example: 2, description: 'Number of adults' })
  adults: number;

  @ApiProperty({ example: 1, description: 'Number of children' })
  children: number;

  @ApiProperty({ example: 'Credit Card', description: 'Guarantee method' })
  guarantee: string;

  @ApiProperty({ example: 'VISA', description: 'Method of payment' })
  method_payment: string;

  @ApiProperty({ example: 'John', description: 'First name of the guest' })
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the guest' })
  last_name: string;

  @ApiProperty({ example: 'Mr', description: 'Title of the guest' })
  title: string;

  @ApiProperty({ example: '2023-07-01', description: 'Booking created date' })
  booking_created_date: string;
}

export class ResponseListSwagger {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'SUCCESS' })
  message: string;

  @ApiProperty({ type: [BookingResponse] })
  data: BookingResponse[];
}

export class ResponseSwagger {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'SUCCESS' })
  message: string;

  @ApiProperty({ type: BookingResponse })
  data: BookingResponse;
}
