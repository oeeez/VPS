import fs from 'fs/promises';
import path from 'path';
import { Logger } from '../utils/Logger';

export class FileStorage {
  private baseDir: string;
  private logger: Logger;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    this.logger = new Logger('FileStorage');
  }

  public async save(key: string, data: any): Promise<void> {
    const filePath = path.join(this.baseDir, `${key}.json`);
    try {
      await fs.writeFile(filePath, JSON.stringify(data), 'utf-8');
      this.logger.info(`Data saved: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to save data: ${key}`, error);
      throw error;
    }
  }

  public async load(key: string): Promise<any | null> {
    const filePath = path.join(this.baseDir, `${key}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      this.logger.info(`Data loaded: ${key}`);
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        this.logger.warn(`Data not found: ${key}`);
        return null;
      }
      this.logger.error(`Failed to load data: ${key}`, error);
      throw error;
    }
  }

  public async delete(key: string): Promise<void> {
    const filePath = path.join(this.baseDir, `${key}.json`);
    try {
      await fs.unlink(filePath);
      this.logger.info(`Data deleted: ${key}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        this.logger.warn(`Data not found for deletion: ${key}`);
        return;
      }
      this.logger.error(`Failed to delete data: ${key}`, error);
      throw error;
    }
  }
}
