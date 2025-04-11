import { container } from '../config/container.js';
import { IPaymentRepository, IUserRepository } from '../database/repositories/index.js';
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
  private readonly userRepository: IUserRepository;

  constructor() {
    this.paymentRepository = container.resolve('paymentRepository');
    this.paymentGateway = container.resolve('paymentGateway');
    this.queueService = container.resolve('queueService');
    this.userRepository = container.resolve('userRepository');
  }

  public async execute(payment: Payment): Promise<CreatePaymentOutput> {
    await this.userRepository.getById(payment.payee_id);

    await this.userRepository.getById(payment.payer_id);

    payment.date = new Date();
    payment.status = PaymentStatus.waiting;

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
