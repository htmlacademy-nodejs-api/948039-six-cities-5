import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/mongo.database-client.js';
import { Component } from '../shared/types/component.enum.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { Container } from 'inversify';
import { CLIApplication } from './cli-application.js';
import { ImportCommand } from './index.js';

export const createSLIApplication = (): Container => {
  const sliContainer = new Container();
  sliContainer.bind<CLIApplication>(Component.CLIApplication).to(CLIApplication).inSingletonScope();
  sliContainer.bind<ImportCommand>(Component.ImportCommand).to(ImportCommand).inSingletonScope();
  sliContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  sliContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  sliContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  return sliContainer;
};
