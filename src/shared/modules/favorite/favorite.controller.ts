import { inject } from 'inversify';
import { BaseController, HttpMethod, PrivateRouteMiddleware, ValidateDtoMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { DefaultFavoriteService, FavoriteEntity } from './index.js';
import mongoose from 'mongoose';
import { OfferRdo } from '../offer/rdo/offer.rdo.js';
import { fillDTO } from '../../helpers/index.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from '../offer/offer.entity.js';
import { CreateOrDeleteRequest } from './favorite-request.type.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { FavoriteRdo } from './rdo/favorite.rdo.js';

export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.FavoriteService) private readonly favoriteService: DefaultFavoriteService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.find,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateFavoriteDto)
      ]
    });
  }

  public async find({tokenPayload}: Request, res: Response): Promise<void> {
    const id = new mongoose.Types.ObjectId(tokenPayload.id);
    const rawFavorites: DocumentType<FavoriteEntity & {offer: OfferEntity}>[] = await this.favoriteService.findByUserId(id);
    const favoriteOffers = rawFavorites.map((favorites) => favorites.offer);
    this.ok(res, fillDTO(OfferRdo, favoriteOffers));
  }

  public async update({tokenPayload, body}: CreateOrDeleteRequest, res: Response): Promise<void> {
    const favoriteDto = {
      offerId: body.offerId,
      userId: tokenPayload.id,
    };
    const result = await this.favoriteService.createOrDelete(favoriteDto);
    if (result === null) {
      this.noContent(res, {});
    } else {
      this.created(res, fillDTO(FavoriteRdo, result));
    }
  }
}
