import { AnalyticsEngine } from './analytics/AnalyticsEngine';
import { AuthManager } from './auth/AuthManager';
import { ControlBus } from './buses/ControlBus';
import { DataBus } from './buses/DataBus';
import { SystemBus } from './buses/SystemBus';
import { UniqueIdentifierBus } from './buses/UniqueIdentifierBus';
import { LocalDevice } from './devices/LocalDevice';
import { FileStorage } from './storage/FileStorage';
import { Logger } from './utils/Logger';
import { Device, DeviceType, Command, DataPacket } from './types';

export class CoreDeviceManager {
  private devices: Map<string, LocalDevice> = new Map();
  private analyticsEngine: AnalyticsEngine;
  private authManager: AuthManager;
  private controlBus: ControlBus;
  private dataBus: DataBus;
  private systemBus: SystemBus;
  private uiBus: UniqueIdentifierBus;
  private fileStorage: FileStorage;
  private logger: Logger;

  constructor() {
    this.analyticsEngine = new AnalyticsEngine();
    this.authManager = new AuthManager();
    this.controlBus = new ControlBus();
    this.dataBus = new DataBus();
    this.systemBus = new SystemBus();
    this.uiBus = new UniqueIdentifierBus();
    this.fileStorage = new FileStorage('./data');
    this.logger = new Logger('CoreDeviceManager');

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.dataBus.subscribe('all', (data: DataPacket) => {
      this.analyticsEngine.processData(data);
    });

    this.systemBus.subscribe((message) => {
      this.logger.info(`System message received: ${JSON.stringify(message)}`);
    });
  }

  public registerDevice(type: DeviceType, name: string): Device {
    const device = new LocalDevice(
      type,
      name,
      this.uiBus,
      this.dataBus,
      this.controlBus,
      this.systemBus
    );
    this.devices.set(device.id, device);
    this.logger.info(`Device registered: ${device.id} (${device.name})`);
    return device;
  }

  public handleDeviceData(deviceId: string, data: any) {
    const device = this.devices.get(deviceId);
    if (device) {
      const dataPacket: DataPacket = {
        deviceId,
        timestamp: Date.now(),
        data,
      };
      this.dataBus.publish(dataPacket);
      this.logger.info(`Data received from device ${deviceId}`);
    } else {
      this.logger.warn(`Data received from unknown device ${deviceId}`);
    }
  }

  public sendCommandToDevice(deviceId: string, command: Command) {
    const device = this.devices.get(deviceId);
    if (device) {
      this.controlBus.sendCommand(deviceId, command);
      this.logger.info(`Command sent to device ${deviceId}: ${command.type}`);
    } else {
      this.logger.warn(`Attempted to send command to unknown device ${deviceId}`);
    }
  }
}
