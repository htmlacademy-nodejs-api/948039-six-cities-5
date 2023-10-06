import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { DefaultOfferService } from './default-offer.service.js';

export const createOfferContainer = () => {
  const userContainter = new Container();

  userContainter.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  userContainter.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  return userContainter;
};
