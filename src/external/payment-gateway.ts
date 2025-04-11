import { Payment } from '../entities/payment.js';

export interface IPaymentGateway {
  authorize(payment: Payment): Promise<boolean>;
}

export class PaymentGateway implements IPaymentGateway {
  public async authorize(payment: Payment): Promise<boolean> {
    return Promise.resolve(true);
  }
}
