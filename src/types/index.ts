export type DeviceType = 'sensor' | 'actuator' | 'controller';

export interface Device {
  id: string;
  type: DeviceType;
  name: string;
  status: 'online' | 'offline';
}

export interface Command {
  type: string;
  payload: any;
}

export interface DataPacket {
  deviceId: string;
  timestamp: number;
  data: any;
}

export interface SystemMessage {
  type: string;
  payload: any;
}
