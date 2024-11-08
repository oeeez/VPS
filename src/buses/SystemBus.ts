import { SystemMessage } from '../types';
import { Logger } from '../utils/Logger';

export class SystemBus {
  private subscribers: ((message: SystemMessage) => void)[] = [];
  private logger: Logger;

  constructor() {
    this.logger = new Logger('SystemBus');
  }

  public subscribe(callback: (message: SystemMessage) => void): void {
    this.subscribers.push(callback);
    this.logger.info('New subscriber added to SystemBus');
  }

  public unsubscribe(callback: (message: SystemMessage) => void): void {
    const index = this.subscribers.indexOf(callback);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
      this.logger.info('Subscriber removed from SystemBus');
    }
  }

  public publish(message: SystemMessage): void {
    this.subscribers.forEach(callback => callback(message));
    this.logger.info(`System message published: ${message.type}`);
  }
}
