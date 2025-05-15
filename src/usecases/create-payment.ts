import { IPaymentRepository, IUserRepository } from '../repositories/index.js';
import { Payment, PaymentStatus } from '../entities/index.js';
import { Channel } from '../shared/index.js';
import { AppContainer } from '../config/container.js';
import { IPaymentGateway } from '../external/payment-gateway.js';
import { IMessageService } from '../external/message-service.js';

export interface CreatePaymentOutput {
  payment_id: number;
  status: PaymentStatus;
}

export class CreatePaymentUseCase {
  private paymentRepository: IPaymentRepository;
  private paymentGateway: IPaymentGateway;
  private messageService: IMessageService;
  private userRepository: IUserRepository;

  constructor(params: AppContainer) {
    this.paymentGateway = params.paymentGateway;
    this.messageService = params.messageService;
    this.userRepository = params.userRepository;
    this.paymentRepository = params.paymentRepository;
  }

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
