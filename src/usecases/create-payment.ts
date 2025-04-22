import { IPaymentRepository, IUserRepository } from '../repositories/index.js';
import { Payment, PaymentStatus } from '../entities/index.js';
import { IPaymentGateway, IMessageService } from '../external/index.js';
import { Channel } from '../shared/index.js';

export interface CreatePaymentOutput {
  payment_id: number;
  status: PaymentStatus;
}

export class CreatePaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentGateway: IPaymentGateway,
    private readonly messageService: IMessageService,
    private readonly userRepository: IUserRepository
  ) {}

  public async execute(payment: Payment): Promise<CreatePaymentOutput> {
    await this.userRepository.getById(payment.payee_id);

    await this.userRepository.getById(payment.payer_id);

    payment.date = new Date();
    payment.status = PaymentStatus.waiting;

    payment.id = await this.paymentRepository.createAndGetId(payment);

    const authorizePayment = await this.paymentGateway.authorize(payment);

    if (authorizePayment) {
      await this.messageService.sendMessage({ payment }, Channel.CONFIRMATION);
    } else {
      await this.messageService.sendMessage({ payment }, Channel.CANCELLATION);
    }

    return {
      payment_id: payment.id,
      status: PaymentStatus.waiting
    };
  }
}
