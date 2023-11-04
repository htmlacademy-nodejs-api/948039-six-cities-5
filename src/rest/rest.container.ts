import { Container } from 'inversify';
import { RestApplication } from './rest.application.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/mongo.database-client.js';
import { Component } from '../shared/types/component.enum.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { AppExceptionFilter, ExceptionFilter } from '../shared/libs/rest/index.js';
import { ValidationExceptionFilter } from '../shared/libs/rest/exception-filter/validation.exception-filter.js';
import { HttpErrorExceptionFilter } from '../shared/libs/rest/exception-filter/http-error.exception-filter.js';
import { PathTransformer } from '../shared/libs/rest/transform/path-transformer.js';

export const createRestApplication = (): Container => {
  const restContainer = new Container();
  restContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  restContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  restContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  restContainer.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();
  restContainer.bind<ExceptionFilter>(Component.HttpExceptionFilter).to(HttpErrorExceptionFilter).inSingletonScope();
  restContainer.bind<ExceptionFilter>(Component.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
  restContainer.bind<PathTransformer>(Component.PathTransformer).to(PathTransformer).inSingletonScope();
  return restContainer;
};
