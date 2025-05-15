import { z } from 'zod';
import { Payment } from '../entities/index.js';
import { CreatePaymentUseCase } from '../usecases/create-payment.js';
import { AppContainer } from '../config/container.js';

const createPaymentSchema = z.object({
  payer_id: z.number().positive(),
  payee_id: z.number().positive(),
  value: z.number().positive()
});

export class CreatePaymentController {
  private createPaymentUseCase: CreatePaymentUseCase;

  constructor(params: AppContainer) {
    this.createPaymentUseCase = params.createPaymentUseCase;
  }

  public async execute(input: any) {
    console.log('Create payment input', { input });

    const createPaymentInput = createPaymentSchema.parse(input);

    const payment = new Payment();
    payment.value = createPaymentInput.value;
    payment.payee_id = createPaymentInput.payee_id;
    payment.payer_id = createPaymentInput.payer_id;

    const output = await this.createPaymentUseCase.execute(payment);

    console.log('Payment created', { output });

    return output;
  }
}
