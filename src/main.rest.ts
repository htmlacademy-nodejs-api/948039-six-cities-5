import 'reflect-metadata';
import {Container} from 'inversify';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createRestApplication } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';

const bootstrap = () => {
  const appContainer = Container.merge(createRestApplication(), createUserContainer(), createOfferContainer());
  const restApplication = appContainer.get<RestApplication>(Component.RestApplication);
  restApplication.init();
};

bootstrap();
