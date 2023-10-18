import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';
import { FavoriteService } from './favorite-service.interface.js';
import { DefaultFavoriteService } from './default-favorite.service.js';
import { FavoriteController } from './favorite.controller.js';
import { Controller } from '../../libs/rest/index.js';

export const createFavoriteContainer = () => {
  const favoriteContainter = new Container();

  favoriteContainter.bind<FavoriteService>(Component.FavoriteService).to(DefaultFavoriteService).inSingletonScope();
  favoriteContainter.bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel).toConstantValue(FavoriteModel);
  favoriteContainter.bind<Controller>(Component.FavoriteController).to(FavoriteController).inSingletonScope();
  return favoriteContainter;
};
