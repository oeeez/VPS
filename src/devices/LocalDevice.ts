import { Device, DeviceType, Command, DataPacket, SystemMessage } from '../types';
import { UniqueIdentifierBus } from '../buses/UniqueIdentifierBus';
import { DataBus } from '../buses/DataBus';
import { ControlBus } from '../buses/ControlBus';
import { SystemBus } from '../buses/SystemBus';
import { Logger } from '../utils/Logger';

export class LocalDevice implements Device {
  public id: string;
  public type: DeviceType;
  public name: string;
  public status: 'online' | 'offline' = 'offline';

  private uiBus: UniqueIdentifierBus;
  private dataBus: DataBus;
  private controlBus: ControlBus;
  private systemBus: SystemBus;
  private logger: Logger;

  constructor(
    type: DeviceType,
    name: string,
    uiBus: UniqueIdentifierBus,
    dataBus: DataBus,
    controlBus: ControlBus,
    systemBus: SystemBus
  ) {
    this.id = uiBus.generateId();
    this.type = type;
    this.name = name;
    this.uiBus = uiBus;
    this.dataBus = dataBus;
    this.controlBus = controlBus;
    this.systemBus = systemBus;
    this.logger = new Logger(`LocalDevice:${this.id}`);

    this.controlBus.subscribe(this.id, this.handleCommand.bind(this));
    this.systemBus.subscribe(this.handleSystemMessage.bind(this));

    this.status = 'online';
    this.logger.info(`Local device created: ${this.name} (${this.type})`);
  }

  private handleCommand(command: Command): void {
    this.logger.info(`Received command: ${command.type}`);
    // Implement command handling logic here
    console.log(JSON.stringify(command, null, 2));
  }

  private handleSystemMessage(message: SystemMessage): void {
    this.logger.info(`Received system message: ${message.type}`);
    // Implement system message handling logic here
    console.log(JSON.stringify(message, null, 2));
  }

  public sendData(data: any): void {
    const dataPacket: DataPacket = {
      deviceId: this.id,
      timestamp: Date.now(),
      data
    };
    this.dataBus.publish(dataPacket);
    this.logger.info('Data sent', data);
  }

  public shutdown(): void {
    this.controlBus.unsubscribe(this.id, this.handleCommand.bind(this));
    this.systemBus.unsubscribe(this.handleSystemMessage.bind(this));
    this.status = 'offline';
    this.logger.info('Device shut down');
  }
}
