import { z } from 'zod';
import { Payment } from '../entities/index.js';
import { CreatePaymentUseCase } from '../usecases/create-payment.js';
import { container } from '../config/container.js';

const createPaymentSchema = z.object({
  payer_id: z.number().positive(),
  payee_id: z.number().positive(),
  value: z.number().positive()
});

export class CreatePaymentController {
  public static async execute(input: any) {
    console.log('Create payment input', { input });

    const createPaymentInput = createPaymentSchema.parse(input);

    const payment = new Payment();
    payment.value = createPaymentInput.value;
    payment.payee_id = createPaymentInput.payee_id;
    payment.payer_id = createPaymentInput.payer_id;

    const createPaymentUseCase = new CreatePaymentUseCase(
      container.resolve('paymentRepository'),
      container.resolve('paymentGateway'),
      container.resolve('messageService'),
      container.resolve('userRepository')
    );

    const output = await createPaymentUseCase.execute(payment);

    console.log('Payment created', { output });

    return output;
  }
}
