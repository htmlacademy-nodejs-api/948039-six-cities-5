import { DocumentType, types } from '@typegoose/typegoose';
import { Component, SortType } from '../../types/index.js';
import { OfferEntity } from './offer.entity.js';
import { inject, injectable } from 'inversify';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { Types } from 'mongoose';
import { OfferService } from './offer-service.interface.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_PREMIUM_OFFER_COUNT } from './offer.constant.js';
import { FindQuery } from './offer-request.type.js';
import { aggregateComments, aggregateFavorite, aggregateDefaultFavorite, matchCity } from './offer.aggregate.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    return await this.offerModel.create(dto);
  }

  public async find(query: FindQuery, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const {size, city} = query;
    const limit = city ? DEFAULT_PREMIUM_OFFER_COUNT : Number(size ?? DEFAULT_OFFER_COUNT);
    const match = city ? matchCity(city) : {};
    const aggregate = userId ? [...aggregateComments, ...aggregateFavorite(userId)] : [...aggregateComments, ...aggregateDefaultFavorite];
    const offers = await this.offerModel
      .aggregate(aggregate)
      .match(match)
      .limit(limit)
      .sort({ createdAt: SortType.Down })
      .exec();
    return offers;
  }

  async findById(id: Types.ObjectId, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const aggregate = userId ? [...aggregateComments, ...aggregateFavorite(userId)] : [...aggregateComments, ...aggregateDefaultFavorite];
    const findByIdResult: DocumentType<OfferEntity>[] = await this.offerModel
      .aggregate([{$match: {_id: id}}, ...aggregate]).exec();
    return findByIdResult[0] ?? null;
  }

  public async updateById(id: Types.ObjectId, dto: UpdateOfferDto, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    await this.offerModel.findByIdAndUpdate(id, dto, {new: true}).exec();
    return this.findById(id, userId);
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndUpdate(offerId, {$inc: {commentsCount: 1}}).exec();
  }

  public async deleteById(id: Types.ObjectId): Promise<DocumentType<OfferEntity> | null>{
    return await this.offerModel.findByIdAndDelete(id).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }
}
