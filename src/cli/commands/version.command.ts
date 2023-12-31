import { inject, injectable } from 'inversify';
import { Command } from './command.interface.js';
import { readFileSync } from 'node:fs';
import { Component } from '../../shared/types/index.js';
import { Logger } from '../../shared/libs/logger/index.js';

type PackageJSONConfig = {
  version: string;
}

const isValidJson = (json: unknown): json is PackageJSONConfig => (
  typeof json === 'object' &&
  json !== null &&
  !Array.isArray(json) &&
  Object.hasOwn(json, 'version')
);

@injectable()
export class VersionCommand implements Command {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    private readonly filePath: string = './package.json'
  ) {}

  private readVersion() {
    const jsonData = readFileSync(this.filePath, 'utf-8');
    const parsedData: unknown = JSON.parse(jsonData);

    if (!isValidJson(parsedData)) {
      throw new Error('Failed to parse json content.');
    }

    return parsedData.version;
  }

  public getName(): string {
    return '--version';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      this.logger.info(version);
    } catch (error: unknown) {
      this.logger.error(`Failed to read version from ${this.filePath}`, error as Error);
    }
  }
}
