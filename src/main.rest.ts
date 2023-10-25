import 'reflect-metadata';
import {Container} from 'inversify';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createRestApplication } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';
import { createFavoriteContainer } from './shared/modules/favorite/index.js';
import { createAuthContainer } from './shared/modules/auth/index.js';

const bootstrap = async () => {
  const appContainer = Container.merge(
    createRestApplication(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createFavoriteContainer(),
    createAuthContainer()
  );
  const restApplication = appContainer.get<RestApplication>(Component.RestApplication);
  await restApplication.init();
};

bootstrap();
