import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { Types } from 'mongoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';


export interface OfferService {
  create(dto: CreateOfferDto, salt: string): Promise<DocumentType<OfferEntity>>;
  findById(id: Types.ObjectId): Promise<DocumentType<OfferEntity> | null>;
}
