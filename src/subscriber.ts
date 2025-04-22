import { container } from './config/container.js';
import { CreatePaymentController } from './controllers/create-payment-controller.js';
import { Channel } from './shared/constants.js';

const subscriber = container.resolve('redisConnection');

subscriber.subscribe(Channel.CONFIRMATION, Channel.CANCELLATION);

subscriber.on('message', async (channel, message) => {
  console.log({ channel, message });
});
