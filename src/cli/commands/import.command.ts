/* eslint-disable no-process-exit */
/* eslint-disable node/no-process-exit */
import { injectable, inject } from 'inversify';
import { getMongoURI } from '../../shared/helpers/index.js';
import { createMockOffer } from '../../shared/helpers/offer.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';
import { Component } from '../../shared/types/component.enum.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer.service.js';
import { DefaultUserService } from '../../shared/modules/user/default-user.service.js';
import { Config, RestSchema } from '../../shared/libs/config/index.js';
import { DatabaseClient } from '../../shared/libs/database-client/index.js';
import { DEFAULT_USER_PASSWORD } from '../constant.js';
import { MockOffer } from '../../shared/types/index.js';
import chalk from 'chalk';
import { Logger } from '../../shared/libs/logger/index.js';

@injectable()
export class ImportCommand implements Command {
  constructor(
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
    @inject(Component.UserService) private readonly userService: DefaultUserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.Logger) private readonly logger: Logger,
  ) {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const mockOffer = createMockOffer(line);
    await this.createOffer(mockOffer);
    resolve();
  }

  private onCompleteImport(count: number) {
    this.logger.info(`${chalk.green(`Successfully imported  ${chalk.bgYellowBright(` ${count} `)} rows`)}`);
    process.exit(0);
  }

  private async createOffer(mockOffer: MockOffer): Promise<void> {
    const {user, ...rawOffer} = mockOffer;
    const userWithPassword = {
      ...user,
      password: DEFAULT_USER_PASSWORD
    };
    const userId = (await this.userService.findOrCreate(userWithPassword, this.config.get('SALT')))._id.toString();
    const offer = {...rawOffer , userId};
    await this.offerService.create(offer);
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());
    await this._initDb();

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error) {
      this.logger.error(`Can't import data from file: ${filename}`, error as Error);
    }
  }
}
