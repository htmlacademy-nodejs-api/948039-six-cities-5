import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { DefaultOfferService } from './default-offer.service.js';
import { Controller } from '../../libs/rest/index.js';
import { OfferController } from './offer.controller.js';

export const createOfferContainer = () => {
  const userContainter = new Container();
  userContainter.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  userContainter.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  userContainter.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();
  return userContainter;
};
