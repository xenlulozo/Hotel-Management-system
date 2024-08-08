export interface IModelBookingTemplate {
  confirmation_no: string;
  resv_name_id: string;
  rateamount: { amount: number; currency: string };
  roomtype: string;
  ratecode: string;
  arrival: string;
  departure: string;
  booking_balance: number;
  adults: number;
  children: number;
  guarantee: string;
  method_payment: string;
  first_name: string;
  last_name: string;
  title: string;
  booking_created_date: string;
}
