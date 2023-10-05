import { Container } from 'inversify';
import { UserService } from './user-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { DefaultUserService, UserEntity, UserModel } from './index.js';
import { types } from '@typegoose/typegoose';

export const createUserContainer = () => {
  const userContainter = new Container();
  userContainter.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainter.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  return userContainter;
};
