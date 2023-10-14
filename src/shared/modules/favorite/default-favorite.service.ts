import { DocumentType, types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { inject, injectable } from 'inversify';
import { FavoriteEntity } from './favorite.entity.js';
import { FavoriteService } from './favorite-service.interface.js';
import { CreateFavoriteDto } from './dto/createFavoriteDto.js';
import { DeleteFavoriteDto } from './dto/deleteFavoriteDto.js';

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

  public async findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]> {
    return await this.favoriteModel.find({userId}).exec();
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
