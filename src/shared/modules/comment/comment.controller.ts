import { inject } from 'inversify';
import { BaseController, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware, PrivateRouteMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { DefaultCommentService, CommentEntity } from './index.js';
import mongoose from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { CommentRdo } from './rdo/comment.rdo.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateCommentRequest, FindByIdRequestParams } from './comment-request.type.js';
import { CreateCommentDto } from './dto/create-comment-dto.js';

export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: DefaultCommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.findById,
      middlewares: [new ValidateObjectIdMiddleware('id')]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Post,
      handler: this.createById,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
  }

  public async findById({params}: Request<FindByIdRequestParams>, res: Response): Promise<void> {
    const id = new mongoose.Types.ObjectId(params.id);
    const comments: DocumentType<CommentEntity>[] = await this.commentService.findByOfferId(id);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async createById({params, body, tokenPayload}: CreateCommentRequest, res: Response): Promise<void> {
    const {id} = params;
    const newComment: CreateCommentDto = {
      text: body.text,
      rate: body.rate,
      postDate: body.postDate,
      userId: tokenPayload.id,
      offerId: id
    };

    const comment = await this.commentService.create(newComment);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
