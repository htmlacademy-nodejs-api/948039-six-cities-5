import { inject, injectable } from 'inversify';
import { DatabaseClient } from './database-client.interface.js';
import * as Mongoose from 'mongoose';
import { Logger } from '../logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.isConnected = false;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB…');
    console.log(uri);
    this.mongoose = await Mongoose.connect(uri);
    this.isConnected = true;
    this.logger.info('Database connection established.');
  }

  public async disconect(): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Not connected to the database');
    }

    await this.mongoose.disconnect();
    this.isConnected = false;
    this.logger.info('Database connection closed.');
  }
}
