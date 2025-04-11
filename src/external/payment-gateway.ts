import { Payment } from '../entities/payment.js';

export interface IPaymentGateway {
  authorize(payment: Payment): Promise<boolean>;
}
