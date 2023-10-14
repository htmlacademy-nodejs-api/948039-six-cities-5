import { DocumentType, types } from '@typegoose/typegoose';
import { Component, SortType } from '../../types/index.js';
import { OfferEntity } from './offer.entity.js';
import { inject, injectable } from 'inversify';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import {Types} from 'mongoose';
import { OfferService } from './offer-service.interface.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_PREMIUM_OFFER_COUNT } from './offer.constant.js';


@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    return await this.offerModel.create(dto);
  }

  public async find(count?: number): Promise<{ offers: DocumentType<OfferEntity>[]; }> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    const offers = await this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'favorites',
            let: { offerId: '$_id', userId: '$userId'},
            pipeline: [
              { $match:
                { $expr:
                  { $and:
                     [
                       { $eq: [ '$offerId', '$$offerId' ] },
                       { $eq: [ '$userId', '$$userId' ] }
                     ]
                  }
                }
              },
            ],
            as: 'favorites'
          },
        },
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id'},
            pipeline: [
              { $match:
                { $expr:
                  { $eq: [ '$offerId', '$$offerId' ] }
                }
              }
            ],
            as: 'comments'
          }
        },
        { $addFields:
          {
            isFavorite: { $toBool: {$size: '$favorites'} },
            commentsRate: {$cond: [
              {
                $ne: [{
                  $size: '$comments'
                },
                0
                ]
              },
              {$divide: [
                {$reduce: {
                  input: '$comments',
                  initialValue: 0,
                  in: {$add: ['$$value', '$$this.rate'],}
                }},
                {$size: '$comments'}
              ]},
              0
            ]}
          }
        },
        { $unset: 'favorites' },
        { $unset: 'comments' },
      ])
      .limit(limit)
      .exec();
    return {offers};
  }

  async findById(id: Types.ObjectId): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).exec();
  }

  public async updateById(id: Types.ObjectId, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndUpdate(id, dto, {new: true}).exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndUpdate(offerId, {$inc: {commentsCount: 1}}).exec();
  }

  public async deleteById(id: Types.ObjectId): Promise<DocumentType<OfferEntity> | null>{
    return await this.offerModel.findByIdAndDelete(id).exec();
  }

  public async findPremiumByCityName(city: string): Promise<DocumentType<OfferEntity>[] | null> {
    return await this.offerModel.find({isPremium: true, city}).sort({ createdAt: SortType.Down }).limit(DEFAULT_PREMIUM_OFFER_COUNT).exec();
  }
}
