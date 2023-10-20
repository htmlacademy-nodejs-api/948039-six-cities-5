/* eslint-disable @typescript-eslint/no-shadow */
import { StatusCodes } from 'http-status-codes';
import { inject } from 'inversify';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { DefaultFavoriteService, FavoriteEntity } from './index.js';
import mongoose from 'mongoose';
import { HttpError } from '../../libs/rest/errors/http-error.js';
import { ShortOfferRdo } from '../offer/rdo/offer.rdo.js';
import { fillDTO } from '../../helpers/index.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from '../offer/offer.entity.js';
import { FindByIdRequestParams } from './favorite-request.type.js';

export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.FavoriteService) private readonly favoriteService: DefaultFavoriteService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoriteController…');

    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.findById });
    this.addRoute({ path: '/:id', method: HttpMethod.Put, handler: this.updateById });
  }

  public async findById({params}: Request<FindByIdRequestParams>, res: Response): Promise<void> {
    const id = new mongoose.Types.ObjectId(params.id);
    const favorites: DocumentType<FavoriteEntity & {offer: OfferEntity}>[] = await this.favoriteService.findByUserId(id);
    const favoriteOffers = favorites.map((favorites) => favorites.offer);

    this.ok(res, fillDTO(ShortOfferRdo, favoriteOffers));
  }

  public async updateById(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_FOUND,
      'Not implements this method.',
      'FavoriteController'
    );
  }
}
