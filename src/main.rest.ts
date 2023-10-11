import 'reflect-metadata';
import {Container} from 'inversify';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createRestApplication } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';
import { createFavoriteContainer } from './shared/modules/favorite/favorite.container.js';

const bootstrap = async () => {
  const appContainer = Container.merge(
    createRestApplication(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createFavoriteContainer()
  );
  const restApplication = appContainer.get<RestApplication>(Component.RestApplication);
  await restApplication.init();
};

bootstrap();
