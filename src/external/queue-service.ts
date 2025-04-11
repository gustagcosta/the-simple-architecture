export interface IQueueService {
  sendMessage(message: object, queue: string): Promise<void>;
}

export class QueueService implements IQueueService {
  public async sendMessage(message: object, queue: string): Promise<void> {
    Promise.resolve();
  }
}
