import { DocumentType, types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { inject, injectable } from 'inversify';
import { FavoriteEntity } from './favorite.entity.js';
import { FavoriteService } from './favorite-service.interface.js';
import { CreateFavoriteDto } from './dto/createFavoriteDto.js';
import { DeleteFavoriteDto } from './dto/deleteFavoriteDto.js';
import {Types} from 'mongoose';
import { OfferEntity } from '../offer/index.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) {}

  public async find(): Promise<DocumentType<FavoriteEntity>[]> {
    const favorites = await this.favoriteModel
      .find().exec();
    return favorites;
  }

  public async findByUserId(userId: Types.ObjectId): Promise<DocumentType<FavoriteEntity & {offer: OfferEntity}>[]> {
    return await this.favoriteModel
      .aggregate([
        {$match: {
          $expr: {
            $eq: [userId, '$userId']
          }
        }},
        {
          $lookup: {
            from: 'offers',
            let: { offerId: '$offerId'},
            pipeline: [
              { $match:
                { $expr:
                  { $eq: [ '$_id', '$$offerId' ] },
                }
              },
            ],
            as: 'offers'
          },
        },
        {$addFields: {
          offer: {$first: '$offers'}
        }}
        , {
          $unset: 'offers'
        },
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$offerId'},
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
            ['offer.isFavorite']: true,
            ['offer.rate']: {$cond: [
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
      ])
      .exec();
  }

  public async createOrDelete(dto: CreateFavoriteDto | DeleteFavoriteDto): Promise<DocumentType<FavoriteEntity> | null> {
    const isExistFavoriteEntity = await this.favoriteModel.exists(dto) !== null;
    if (isExistFavoriteEntity) {
      return await this.favoriteModel.findOneAndDelete(dto).exec();
    } else {
      return await this.favoriteModel.create(dto);
    }
  }
}
