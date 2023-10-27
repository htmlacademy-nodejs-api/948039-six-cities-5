import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/index.js';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'favorites',
  },
  options: {
    allowMixed: 0
  }
})
export class FavoriteEntity extends defaultClasses.TimeStamps {
  @prop({
    ref: OfferEntity,
    required: true
  })
  public offerId: Ref<OfferEntity>;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId: Ref<UserEntity>;

  public id: string;

  public _id: Types.ObjectId;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
