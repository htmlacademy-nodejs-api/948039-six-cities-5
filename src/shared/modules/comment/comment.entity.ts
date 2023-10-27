import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/index.js';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'comments',
  },
  options: {
    allowMixed: 0
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({required: true})
  public text: string;

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

  @prop()
  public rate: number;

  public id: string;

  public _id: Types.ObjectId;
}

export const CommentModel = getModelForClass(CommentEntity);
