import { createContainer, asClass, AwilixContainer } from 'awilix';
import {
  IPaymentRepository,
  IUserRepository,
  PaymentRepository,
  UserRepository
} from '../database/repositories/index.js';
import { IPaymentGateway, IQueueService, PaymentGateway, QueueService } from '../external/index.js';

type AppContainer = {
  userRepository: IUserRepository;
  paymentRepository: IPaymentRepository;
  paymentGateway: IPaymentGateway;
  queueService: IQueueService;
};

const container: AwilixContainer<AppContainer> = createContainer<AppContainer>();

container.register({
  userRepository: asClass(UserRepository).singleton(),
  paymentRepository: asClass(PaymentRepository).singleton(),
  paymentGateway: asClass(PaymentGateway).singleton(),
  queueService: asClass(QueueService).singleton()
});

console.log('container created');

export { container };
