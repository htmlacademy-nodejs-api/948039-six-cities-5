import { inject } from 'inversify';
import { BaseController, DocumentExistsMiddleware, HttpMethod, PrivateRouteMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { UpdateByIdRequest, CreateRequest, DeleteByIdRequestParams, FindByIdRequestParams, FindRequest } from './offer-request.type.js';
import { DefaultOfferService } from './index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import mongoose from 'mongoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { HttpError } from '../../libs/rest/errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { DefaultCommentService } from '../comment/index.js';

export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: DefaultOfferService,
    @inject(Component.CommentService) private readonly commentService: DefaultCommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.find });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.findById,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Put,
      handler: this.updateById,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id'),
        new ValidateDtoMiddleware(UpdateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.deleteById,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'id'),
      ]
    });
  }

  public async create({body, tokenPayload}: CreateRequest, res: Response): Promise<void> {
    const userId = tokenPayload.id;
    const newOffer = await this.offerService.create({...body, userId});
    const createdOffer = Object.assign(newOffer , {isFavorite: false , rate: 0, commentsCount: 0});
    this.created(res, fillDTO(OfferRdo, createdOffer));
  }

  public async find({query, tokenPayload}: FindRequest, res: Response): Promise<void> {
    const userId = tokenPayload?.id;
    const result = await this.offerService.find(query, userId);
    this.ok(res, fillDTO(OfferRdo, result));
  }

  public async findById({params, tokenPayload}: Request<FindByIdRequestParams>, res: Response): Promise<void> {
    const id = new mongoose.Types.ObjectId(params.id);
    const userId = tokenPayload?.id;
    const existOffer = await this.offerService.findById(id, userId);
    this.ok(res, fillDTO(OfferRdo, existOffer));
  }

  public async updateById({params, body, tokenPayload}: UpdateByIdRequest, res: Response): Promise<void> {
    const id = new mongoose.Types.ObjectId(params.id);
    const offer = await this.offerService.findById(id);
    const userId = tokenPayload?.id;
    if (offer && offer.userId.toString() !== userId) {
      throw new HttpError(StatusCodes.METHOD_NOT_ALLOWED, 'Пользователь не имеет доступ к изменению данного ресурса');
    }
    const updatedOffer = await this.offerService.updateById(id, body, userId);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async deleteById({params, tokenPayload}: Request<DeleteByIdRequestParams>, res: Response): Promise<void> {
    const id = new mongoose.Types.ObjectId(params.id);
    const offer = await this.offerService.findById(id);
    if (offer && offer.userId.toString() !== tokenPayload.id) {
      throw new HttpError(StatusCodes.METHOD_NOT_ALLOWED, 'Пользователь не имеет доступ к изменению данного ресурса');
    }
    await this.offerService.deleteById(id);
    await this.commentService.deleteByOfferId(id);
    this.noContent(res, {});
  }
}
