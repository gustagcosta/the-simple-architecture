import { Redis } from 'ioredis';
import { Channel } from '../shared/index.js';
import { AppContainer } from '../config/container.js';

export interface IMessageService {
  sendMessage(message: object, channel: Channel): Promise<void>;
}

export class MessageService implements IMessageService {
  private redisConnection: Redis;

  constructor({ redisConnection }: AppContainer) {
    this.redisConnection = redisConnection;
  }

  public async sendMessage(message: object, channel: Channel): Promise<void> {
    await this.redisConnection.publish(channel, JSON.stringify(message));
  }
}
