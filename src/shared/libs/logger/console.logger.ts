import { injectable } from 'inversify';
import { getErrorMessage } from '../../helpers/index.js';
import { Logger } from './logger.interface.js';

@injectable()
export class ConsoleLogger implements Logger {
  info(message: string, ...args: unknown[]): void {
    console.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(message, ...args);
  }

  error(message: string, error: Error, ...args: unknown[]): void {
    console.error(message, ...args);
    console.error(`Error message: ${getErrorMessage(error)}`);
  }

  debug(message: string, ...args: unknown[]): void {
    console.debug(message, ...args);
  }
}
