import { DataPacket } from '../types';
import { Logger } from '../utils/Logger';

export class DataBus {
  private subscribers: Map<string, ((data: DataPacket) => void)[]> = new Map();
  private logger: Logger;

  constructor() {
    this.logger = new Logger('DataBus');
  }

  public subscribe(deviceId: string, callback: (data: DataPacket) => void): void {
    if (!this.subscribers.has(deviceId)) {
      this.subscribers.set(deviceId, []);
    }
    this.subscribers.get(deviceId)!.push(callback);
    this.logger.info(`Device ${deviceId} subscribed to DataBus`);
  }

  public unsubscribe(deviceId: string, callback: (data: DataPacket) => void): void {
    const deviceSubscribers = this.subscribers.get(deviceId);
    if (deviceSubscribers) {
      const index = deviceSubscribers.indexOf(callback);
      if (index !== -1) {
        deviceSubscribers.splice(index, 1);
        this.logger.info(`Device ${deviceId} unsubscribed from DataBus`);
      }
    }
  }

  public publish(data: DataPacket): void {
    const deviceSubscribers = this.subscribers.get(data.deviceId);
    if (deviceSubscribers) {
      deviceSubscribers.forEach(callback => callback(data));
      this.logger.info(`Data published for device ${data.deviceId}`);
    } else {
      this.logger.warn(`No subscribers found for device ${data.deviceId}`);
    }

    // Also publish to 'all' subscribers
    const allSubscribers = this.subscribers.get('all');
    if (allSubscribers) {
      allSubscribers.forEach(callback => callback(data));
    }
  }
}
