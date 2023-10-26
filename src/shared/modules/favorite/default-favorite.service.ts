import { DocumentType, types } from '@typegoose/typegoose';
import { Component, SortType } from '../../types/index.js';
import { inject, injectable } from 'inversify';
import { FavoriteEntity } from './favorite.entity.js';
import { FavoriteService } from './favorite-service.interface.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { DeleteFavoriteDto } from './dto/deleteFavoriteDto.js';
import {Types} from 'mongoose';
import { OfferEntity } from '../offer/index.js';
import { addIsFavorite, addRate, findByUserId, lookupComments, lookupOffer, unwindOffer } from './favorite.aggregate.js';

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
        findByUserId(userId),
        lookupOffer,
        unwindOffer,
        lookupComments,
        addIsFavorite,
        addRate
      ])
      .sort({ createdAt: SortType.Down })
      .exec();
  }

  public async createOrDelete(dto: CreateFavoriteDto | DeleteFavoriteDto): Promise<DocumentType<FavoriteEntity> | null> {
    const isExistFavoriteEntity = await this.favoriteModel.exists(dto) !== null;
    if (isExistFavoriteEntity) {
      await this.favoriteModel.findOneAndDelete(dto).exec();
      return null;
    } else {
      return await this.favoriteModel.create(dto);
    }
  }
}
