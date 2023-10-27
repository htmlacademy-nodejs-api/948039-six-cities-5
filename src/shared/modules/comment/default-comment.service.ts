import { DocumentType, types } from '@typegoose/typegoose';
import { Component, SortType } from '../../types/index.js';
import { inject, injectable } from 'inversify';
import { CommentEntity } from './comment.entity.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment-dto.js';
import { DEFAULT_COMMENT_COUNT } from './comment.constant.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    return await this.commentModel.create(dto);
  }

  public async findByOfferId(offerId: Types.ObjectId, count?: number): Promise<DocumentType<CommentEntity>[]> {
    const baseCount = count ?? DEFAULT_COMMENT_COUNT;
    const limit = baseCount > DEFAULT_COMMENT_COUNT ? DEFAULT_COMMENT_COUNT : baseCount;
    return await this.commentModel.find({offerId}).sort({ createdAt: SortType.Down })
      .limit(limit).exec();
  }

  public async deleteByOfferId(offerId: Types.ObjectId): Promise<null> {
    await this.commentModel
      .deleteMany({offerId})
      .exec();

    return null;
  }
}
