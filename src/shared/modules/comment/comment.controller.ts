import { inject } from 'inversify';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { DefaultCommentService, CommentEntity } from './index.js';
import mongoose from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { CommentRdo } from './rdo/comment.rdo.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateCommentRequest } from './create-comment-request.type.js';
import { CreateCommentDto } from './dto/createCommentDto.js';

export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: DefaultCommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.findById });
    this.addRoute({ path: '/:id', method: HttpMethod.Post, handler: this.createById });
  }

  public async findById({params}: Request, res: Response): Promise<void> {
    const id = new mongoose.Types.ObjectId(params.id);
    const comments: DocumentType<CommentEntity>[] = await this.commentService.findByOfferId(id);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async createById({params, body}: CreateCommentRequest, res: Response): Promise<void> {
    const id = new mongoose.Types.ObjectId(params.id as string).toString();
    const newComment: CreateCommentDto = {
      ...body,
      offerId: id
    };

    const comment = await this.commentService.create(newComment);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
