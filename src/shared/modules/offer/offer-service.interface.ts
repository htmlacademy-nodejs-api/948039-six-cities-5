import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { Types } from 'mongoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { FindQuery } from './offer-request.type.js';
import { DocumentExists } from '../../libs/rest/index.js';


export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto, salt: string): Promise<DocumentType<OfferEntity>>;
  findById(id: Types.ObjectId, userId?: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(id:Types.ObjectId, dto: UpdateOfferDto, userId?: string): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id:Types.ObjectId):Promise<DocumentType<OfferEntity> | null>;
  find(query: FindQuery, userId?: string): Promise<Array<DocumentType<OfferEntity>>>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
