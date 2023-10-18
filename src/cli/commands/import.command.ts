import { injectable, inject } from 'inversify';
import { generateRandomValue, getMongoURI, getRandomItem, getRandomItems } from '../../shared/helpers/index.js';
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
import { CreateOfferDto } from '../../shared/modules/offer/dto/create-offer.dto.js';
import { DefaultCommentService } from '../../shared/modules/comment/default-comment.service.js';
import { CreateCommentDto } from '../../shared/modules/comment/dto/createCommentDto.js';
import { DefaultFavoriteService } from '../../shared/modules/favorite/default-favorite.service.js';
import { CreateFavoriteDto } from '../../shared/modules/favorite/dto/createFavoriteDto.js';

@injectable()
export class ImportCommand implements Command {
  private uniqUsers: Set<string> = new Set();
  constructor(
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
    @inject(Component.UserService) private readonly userService: DefaultUserService,
    @inject(Component.CommentService) private readonly commentService: DefaultCommentService,
    @inject(Component.FavoriteService) private readonly favoriteService: DefaultFavoriteService,
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
    const offerId = await this.createOffer(mockOffer);
    await this.createComments(offerId);
    await this.createFavorites(offerId);
    resolve();
  }

  private async onCompleteImport(count: number) {
    this.logger.info(`${chalk.green(`Successfully imported  ${chalk.bgYellowBright(` ${count} `)} rows`)}`);
    await this.databaseClient.disconect();
  }

  private async createOffer(mockOffer: MockOffer): Promise<string> {
    const {user, ...rawOffer} = mockOffer;
    const userWithPassword = {
      ...user,
      password: DEFAULT_USER_PASSWORD
    };
    const userId = (await this.userService.findOrCreate(userWithPassword, this.config.get('SALT')))._id.toString();
    this.uniqUsers.add(userId);
    const offer:CreateOfferDto = {...rawOffer , userId};
    const offerId = (await this.offerService.create(offer))._id.toString();
    return offerId;
  }

  private async createComments(offerId: string): Promise<void> {
    const users = Array.from(this.uniqUsers);
    const randomCommentCount = generateRandomValue(0, 10);
    for (let i = 0; i < randomCommentCount; i++) {
      const randomUser = getRandomItem(users);
      const comment: CreateCommentDto = {
        text: getRandomItem(['Все было круто!', 'В целом неплохо', 'Все было ужасно']),
        offerId,
        userId: randomUser,
        rate: generateRandomValue(1, 5),
      };

      await this.commentService.create(comment);
    }
  }

  private async createFavorites(offerId: string): Promise<void> {
    const users = Array.from(this.uniqUsers);
    const randomUniqUsers = getRandomItems(users);
    for (let i = 0; i < randomUniqUsers.length; i++) {
      const favoriteDto: CreateFavoriteDto = {
        userId: randomUniqUsers[i],
        offerId
      };
      await this.favoriteService.createOrDelete(favoriteDto);
    }
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
      await fileReader.read();
    } catch (error) {
      this.logger.error(`Can't import data from file: ${filename}`, error as Error);
    }
  }
}
