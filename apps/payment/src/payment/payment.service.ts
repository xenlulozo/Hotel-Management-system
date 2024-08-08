import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GrpcClientService } from '../grpc/client/grpc.client.service';
import axios from 'axios';
import * as FormData from 'form-data';
import { BookingTemplate } from '../grpc/client/booking';
import { config } from 'dotenv';
import * as crypto from 'crypto';

config();
@Injectable()
export class PaymentService {
  constructor(private readonly grpcClientService: GrpcClientService) {}

  async createOrder(id: string): Promise<{ isSuccess: boolean; message: string; checkout_url?: string }> {
    const booking = await this.grpcClientService.detailBooking({ id: id });

    if (booking.status != HttpStatus.OK) throw new HttpException('Booking not found', HttpStatus.BAD_REQUEST);
    const bookingData: BookingTemplate = booking.data;
    const form = new FormData();
    const {
      amount,
      buyer_address,
      buyer_email,
      buyer_fullname,
      buyer_mobile,
      cancel_url,
      currency,
      language,
      merchant_passcode,
      merchant_site_code,
      notify_url,
      order_code,
      order_description,
      return_url
    } = {
      merchant_site_code: process.env.MERCHANT_SITE_CODE || '',
      order_code: id || '',
      order_description: 'missing',
      amount: bookingData.rateamount.amount || 0,
      currency: bookingData.rateamount.currency || '',
      buyer_fullname: (bookingData.first_name || '') + ' ' + (bookingData.last_name || ''),
      buyer_email: bookingData.email || 'missing@gmail.com',
      buyer_mobile: bookingData.phone_number || '0123456789',
      buyer_address: bookingData.address || 'missing',
      return_url: process.env.ULR_REDIRECT_PAYMENT_SUCCESS || '',
      cancel_url: process.env.ULR_REDIRECT_PAYMENT_FAIL || '',
      notify_url: process.env.ULR_NOTIFY || '',
      language: process.env.LANGUAGE || '',
      merchant_passcode: process.env.MERCHAIN_PASSWORD || ''
    };

    // Amount order = 0
    if (amount == 0)
      return {
        isSuccess: false,
        message: 'Cannot create order with amount = 0'
      };

    const material =
      `${merchant_site_code}|${order_code}|${order_description}|${amount}|${currency}|` +
      `${buyer_fullname}|${buyer_email}|${buyer_mobile}|${buyer_address}|${return_url}|` +
      `${cancel_url}|${notify_url}|${language}|${merchant_passcode}`;

    const checksum = crypto.createHash('md5').update(material).digest('hex');

    form.append('function', 'CreateOrder');

    form.append('merchant_site_code', merchant_site_code);
    form.append('order_code', order_code);

    form.append('checksum', checksum);
    // form.append('version', process.env.VERSION || '');

    form.append('language', language);

    form.append('amount', amount);
    form.append('currency', currency);

    form.append('buyer_fullname', buyer_fullname);
    form.append('buyer_email', buyer_email);
    form.append('buyer_address', buyer_address);

    form.append('return_url', return_url);
    form.append('cancel_url', cancel_url);
    form.append('order_description', order_description);

    form.append('notify_url', notify_url);
    form.append('buyer_mobile', buyer_mobile);

    try {
      const response = await axios.post(process.env.API_CREATE_ORDER || '', form);
      if (response.data.result_code == '0000') {
        return {
          isSuccess: true,
          message: 'SUCCESS',
          checkout_url: response.data.result_data.checkout_url
        };
      }
      // console.log('🚀 ~ PaymentService ~ createOrder ~ response:', response.data.result_data.token_code);
      else
        return {
          isSuccess: false,
          message: 'Create Order fail'
        };
    } catch (error) {
      console.log('🚀 ~ PaymentService ~ createOrder ~ error:', error);
      // Handle error
      return {
        isSuccess: false,
        message: 'AXIOS ERROR'
      };
    }
  }
}
