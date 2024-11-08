import { Command } from '../types';
import { Logger } from '../utils/Logger';

export class ControlBus {
  private subscribers: Map<string, ((command: Command) => void)[]> = new Map();
  private logger: Logger;

  constructor() {
    this.logger = new Logger('ControlBus');
  }

  public subscribe(deviceId: string, callback: (command: Command) => void): void {
    if (!this.subscribers.has(deviceId)) {
      this.subscribers.set(deviceId, []);
    }
    this.subscribers.get(deviceId)!.push(callback);
    this.logger.info(`Device ${deviceId} subscribed to ControlBus`);
  }

  public unsubscribe(deviceId: string, callback: (command: Command) => void): void {
    const deviceSubscribers = this.subscribers.get(deviceId);
    if (deviceSubscribers) {
      const index = deviceSubscribers.indexOf(callback);
      if (index !== -1) {
        deviceSubscribers.splice(index, 1);
        this.logger.info(`Device ${deviceId} unsubscribed from ControlBus`);
      }
    }
  }

  public sendCommand(deviceId: string, command: Command): void {
    const deviceSubscribers = this.subscribers.get(deviceId);
    if (deviceSubscribers) {
      deviceSubscribers.forEach(callback => callback(command));
      this.logger.info(`Command sent to device ${deviceId}: ${command.type}`);
    } else {
      this.logger.warn(`No subscribers found for device ${deviceId}`);
    }
  }
}
