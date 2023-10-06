import got from 'got';
import { Component, MockServerData } from '../../shared/types/index.js';
import { Command } from './command.interface.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/tsv-file-writer.js';
import { inject, injectable } from 'inversify';
import { Logger } from '../../shared/libs/logger/logger.interface.js';
import chalk from 'chalk';

@injectable()
export class GenerateCommand implements Command {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
  ) {}

  private initialData: MockServerData;

  public getName(): string {
    return '--generate';
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);
    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      this.logger.info(`${chalk.green(`Successfully generated  ${chalk.bgYellowBright(` ${offerCount} `)} offers`)}`);
    } catch (error: unknown) {
      this.logger.error('Can\'t generate data', error as Error);
    }
  }
}
