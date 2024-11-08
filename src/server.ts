import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { CoreDeviceManager } from './CoreDeviceManager';
import { Logger } from './utils/Logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const logger = new Logger('Server');

app.use(cors());
app.use(bodyParser.json());

const coreDeviceManager = new CoreDeviceManager();

app.post('/api/device/register', (req, res) => {
  const { deviceType, deviceName } = req.body;
  const device = coreDeviceManager.registerDevice(deviceType, deviceName);
  res.json(device);
});

app.post('/api/device/data', (req, res) => {
  const { deviceId, data } = req.body;
  coreDeviceManager.handleDeviceData(deviceId, data);
  res.sendStatus(200);
});

app.post('/api/device/command', (req, res) => {
  const { deviceId, command } = req.body;
  coreDeviceManager.sendCommandToDevice(deviceId, command);
  res.sendStatus(200);
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
