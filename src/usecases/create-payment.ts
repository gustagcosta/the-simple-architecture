import { container } from '../config/container.js';
import { IPaymentRepository } from '../database/repositories/index.js';
import { Payment, PaymentStatus } from '../entities/index.js';
import { IPaymentGateway, IQueueService } from '../external/index.js';

export interface CreatePaymentOutput {
  payment_id: number;
  status: PaymentStatus;
}

export class CreatePaymentUseCase {
  private readonly paymentRepository: IPaymentRepository;
  private readonly paymentGateway: IPaymentGateway;
  private readonly queueService: IQueueService;

  constructor() {
    this.paymentRepository = container.resolve('paymentRepository');
    this.paymentGateway = container.resolve('paymentGateway');
  }

  public async execute(payment: Payment): Promise<CreatePaymentOutput> {
    payment.id = await this.paymentRepository.createAndGetId(payment);

    const authorizePayment = await this.paymentGateway.authorize(payment);

    if (authorizePayment) {
      await this.queueService.sendMessage({ payment }, process.env.CONFIRMATION_QUEUE!);
    } else {
      await this.queueService.sendMessage({ payment }, process.env.CANCELLATION_QUEUE!);
    }

    return {
      payment_id: 1,
      status: PaymentStatus.waiting
    };
  }
}
