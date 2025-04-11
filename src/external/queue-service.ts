export interface IQueueService {
  sendMessage(message: object, queue: string): Promise<void>;
}

class QueueService implements IQueueService {
  public async sendMessage(message: object, queue: string): Promise<void> {
    console.log('messsage sended');
    Promise.resolve();
  }
}
