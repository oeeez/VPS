import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Logger } from '../utils/Logger';

interface User {
  id: string;
  username: string;
  passwordHash: string;
}

export class AuthManager {
  private users: User[] = [];
  private logger: Logger;

  constructor() {
    this.logger = new Logger('AuthManager');
  }

  public async registerUser(username: string, password: string): Promise<string> {
    const existingUser = this.users.find(u => u.username === username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: Date.now().toString(),
      username,
      passwordHash,
    };

    this.users.push(newUser);
    this.logger.info(`User registered: ${username}`);

    return newUser.id;
  }

  public async authenticateUser(username: string, password: string): Promise<string> {
    const user = this.users.find(u => u.username === username);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
    this.logger.info(`User authenticated: ${username}`);

    return token;
  }

  public verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string };
      return decoded;
    } catch (error) {
      this.logger.error('Token verification failed', error);
      throw new Error('Invalid token');
    }
  }
}
