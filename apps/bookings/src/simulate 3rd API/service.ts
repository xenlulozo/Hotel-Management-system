import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import * as xml2js from 'xml2js';
import * as fs from 'fs';
import { parseString } from 'xml2js';
import { IModelBookingTemplate } from './interface/bookingModel.interface';

@Injectable()
export class Service implements OnModuleInit {
  private _Booking: IModelBookingTemplate[] = [];
  async onModuleInit() {
    // Fake data template for API
    const fullDirectoryPath = join(process.cwd(), 'apps/bookings/src/xml');
    const fileNames = readdirSync(fullDirectoryPath);

    for (const fileName of fileNames) {
      const filePath = join(fullDirectoryPath, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      await this.convertXmlToJson(fileContent);
    }

    console.log(this._Booking);
  }

  getBooking(confirmation_no: string): IModelBookingTemplate {
    const booking = this._Booking.find((i) => i.confirmation_no == confirmation_no);
    if (!booking) throw new HttpException('Booking not found!', HttpStatus.BAD_REQUEST);
    return booking;
  }

  async convertXmlToJson(xml: string): Promise<any> {
    const options = {
      explicitArray: false,
      trim: true,
      normalizeTags: true,
      // normalize: true,
      explicitRoot: true,
      preserveChildrenOrder: true,
      charsAsChildren: true,
      includeWhiteChars: true,
      // ignoreAttrs: true,
      mergeAttrs: true,
      tagNameProcessors: [xml2js.processors.stripPrefix]
    };

    parseString(xml, options, (err, result) => {
      const data = result['envelope']['body'].fetchbookingresponse.hotelreservation;
      const fooObjet: IModelBookingTemplate = {
        confirmation_no: '',
        resv_name_id: '',
        rateamount: {
          amount: 0,
          currency: ''
        },
        roomtype: '',
        ratecode: '',
        arrival: '',
        departure: '',
        booking_balance: 0,
        adults: 0,
        children: 0,
        guarantee: '',
        method_payment: '',
        first_name: '',
        last_name: '',
        title: '',
        booking_created_date: ''
      };

      // RESERVATION
      fooObjet.confirmation_no = data.uniqueidlist.uniqueid[0]['_'] || '';

      fooObjet.resv_name_id = data.uniqueidlist.uniqueid.find((item) => item.source == 'RESVID')['_'] || '';

      // ROOM RATE
      const room = data.roomstays.roomstay;

      const roomRate = room.roomrates.roomrate;
      fooObjet.rateamount = {
        amount: roomRate.rates.rate.base['_'] || '',
        currency: roomRate.rates.rate.base.currencyCode || ''
      };

      fooObjet.roomtype = roomRate.roomTypeCode || '';
      fooObjet.ratecode = roomRate.ratePlanCode || '';

      fooObjet.arrival = room.timespan.startdate || '';
      fooObjet.departure = room.timespan.enddate || '';

      const countGuest = room.guestcounts.guestcount;
      fooObjet.booking_balance = room.currentbalance['_'] || '';

      fooObjet.adults = countGuest.find((i) => i.ageQualifyingCode == 'ADULT').count || 0;
      fooObjet.children = countGuest.find((i) => i.ageQualifyingCode == 'CHILD').count || 0;

      fooObjet.guarantee = data.roomstays.roomstay.guarantee.guaranteeType || '';

      // PAYMENT
      fooObjet.method_payment = data.reservationpayments.reservationpaymentinfo.PaymentType || '';

      // USER
      const profile = data.resguests.resguest.profiles.profile;
      const guest = profile?.length ? profile[0].customer.personname : profile.customer.personname;
      fooObjet.first_name = guest.firstname || '';
      fooObjet.last_name = guest.lastname || '';
      fooObjet.title = guest.nametitle || '';
      // BOOKING HISTORY
      fooObjet.booking_created_date = data.reservationhistory.insertDate || '';
      this._Booking.push(fooObjet);
    });
  }
}
