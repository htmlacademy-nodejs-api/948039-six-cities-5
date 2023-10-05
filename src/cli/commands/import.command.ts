import { injectable, inject } from 'inversify';
import { getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { createOffer } from '../../shared/helpers/offer.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';
import { Component } from '../../shared/types/component.enum.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer.service.js';
import { DefaultUserService } from '../../shared/modules/user/default-user.service.js';
import { Config, RestSchema } from '../../shared/libs/config/index.js';
import { CreateUserDto } from '../../shared/modules/user/dto/create-user.dto.js';
import { UserTypeEnum } from '../../shared/types/user-type.enum.js';
import { DatabaseClient } from '../../shared/libs/database-client/index.js';

@injectable()
export class ImportCommand implements Command {
  constructor(
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
    @inject(Component.UserService) private readonly userService: DefaultUserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
  ) {
    console.log(this.userService);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedLine(line: string) {
    console.log(this.config.get('DB_HOST'));
    const offer = createOffer(line);
    const email = offer.email;

    const generateUser = (emailProps: string): CreateUserDto => ({
      email: emailProps,
      name: 's',
      avatar: 'sda',
      type: UserTypeEnum.default,
      password: '13123'
    });

    const generatedUser = generateUser(email);

    const user = await this.userService.findOrCreate(generatedUser, this.config.get('SALT'));


    const adsca = Object.assign({}, offer, {userId: user._id.toString()});

    await this.offerService.create(adsca);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
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
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
