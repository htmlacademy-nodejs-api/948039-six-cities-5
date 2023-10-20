import { inject } from 'inversify';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import {StatusCodes} from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { HttpError } from '../../libs/rest/errors/http-error.js';
import { UpdateByIdRequest, CreateRequest, DeleteByIdRequestParams, FindByIdRequestParams, FindRequest } from './offer-request.type.js';
import { DefaultOfferService } from './index.js';
import { OfferRdo, ShortOfferRdo } from './rdo/offer.rdo.js';
import mongoose from 'mongoose';

export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.find });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.findById });
    this.addRoute({ path: '/:id', method: HttpMethod.Put, handler: this.updateById });
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.deleteById });
  }

  public async create({body}: CreateRequest, res: Response): Promise<void> {
    const newOffer = await this.offerService.create(body);
    const createdOffer = Object.assign(newOffer , {isFavorite: false , rate: 0});
    this.created(res, fillDTO(OfferRdo, createdOffer));
  }

  public async find({query}: FindRequest, res: Response): Promise<void> {
    const result = await this.offerService.find(query);
    this.ok(res,fillDTO(ShortOfferRdo, result));
  }

  public async findById({params}: Request<FindByIdRequestParams>, res: Response): Promise<void> {
    const id = new mongoose.Types.ObjectId(params.id);
    const existOffer = await this.offerService.findById(id);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${params.id}» not exists.`,
        'OfferController'
      );
    }
    this.ok(res, fillDTO(OfferRdo, existOffer));
  }

  public async updateById({params, body}: UpdateByIdRequest, res: Response): Promise<void> {
    const id = new mongoose.Types.ObjectId(params.id);
    const existOffer = await this.offerService.findById(id);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${params.id}» not exists.`,
        'OfferController'
      );
    }
    const updatedOffer = await this.offerService.updateById(id, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async deleteById({params}: Request<DeleteByIdRequestParams>, res: Response): Promise<void> {
    const id = new mongoose.Types.ObjectId(params.id);
    const existOffer = await this.offerService.deleteById(id);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id «${params.id}» not exists.`,
        'OfferController'
      );
    }
    this.noContent(res, {});
  }
}
