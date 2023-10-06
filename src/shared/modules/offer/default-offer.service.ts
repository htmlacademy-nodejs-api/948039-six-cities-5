import { DocumentType, types } from '@typegoose/typegoose';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { OfferEntity } from './offer.entity.js';
import { inject, injectable } from 'inversify';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import {Types} from 'mongoose';

@injectable()
export class DefaultOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${result._id}`);
    return result;
  }

  async findById(id: Types.ObjectId): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id);
  }
}
