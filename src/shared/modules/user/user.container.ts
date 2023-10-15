import { Container } from 'inversify';
import { UserService } from './user-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { DefaultUserService, UserController, UserEntity, UserModel } from './index.js';
import { types } from '@typegoose/typegoose';
import { Controller } from '../../libs/rest/index.js';

export const createUserContainer = () => {
  const userContainter = new Container();
  userContainter.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainter.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainter.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();
  return userContainter;
};
