import { Container } from 'inversify';
import { RestApplication } from './rest.application.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/mongo.database-client.js';
import { Component } from '../shared/types/component.enum.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';

export const createRestApplication = (): Container => {
  const restContainer = new Container();
  restContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  restContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  restContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  return restContainer;
};
