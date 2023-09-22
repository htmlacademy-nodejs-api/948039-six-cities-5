import { Command } from './command.interface.js';
import { readFileSync } from 'node:fs';

type PackageJSONConfig = {
  version: string;
}

const isValidJson = (json: unknown): json is PackageJSONConfig => {
  if (typeof json === 'object' &&
        json !== null &&
        !Array.isArray(json) &&
        Object.hasOwn(json, 'version')
  ) {
    return true;
  } else {
    return false;
  }
};

export class VersionCommand implements Command {
  constructor(private readonly filePath: string = './package.json') {}

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
      console.info(version);
    } catch (error: unknown) {
      console.error(`Failed to read version from ${this.filePath}`);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
