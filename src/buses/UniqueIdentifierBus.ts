import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../utils/Logger';

export class UniqueIdentifierBus {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('UniqueIdentifierBus');
  }

  public generateId(): string {
    const id = uuidv4();
    this.logger.info(`Generated new unique identifier: ${id}`);
    return id;
  }
}
