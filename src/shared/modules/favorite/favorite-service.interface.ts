import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { CreateFavoriteDto } from './dto/createFavoriteDto.js';
import { DeleteFavoriteDto } from './dto/deleteFavoriteDto.js';
import { Types } from 'mongoose';


export interface FavoriteService {
  find(): Promise<DocumentType<FavoriteEntity>[]>;
  findByUserId(userId: Types.ObjectId): Promise<DocumentType<FavoriteEntity>[]>;
  createOrDelete(dto: CreateFavoriteDto | DeleteFavoriteDto): Promise<DocumentType<FavoriteEntity> | null>;
}
