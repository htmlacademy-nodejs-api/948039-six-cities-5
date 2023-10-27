import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { City, Convenience, HouseTypeEnum } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
  options: {
    allowMixed: 0
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop()
  public title: string;

  @prop()
  public description: string;

  @prop()
  public postDate: Date;

  @prop()
  public city: City;

  @prop()
  public preview: string;

  @prop()
  public images: string[];

  @prop()
  public isPremium: boolean;

  @prop()
  public houseType: HouseTypeEnum;

  @prop()
  public room: number;

  @prop()
  public guest: number;

  @prop()
  public price: number;

  @prop()
  public conveniences: Convenience[];

  @prop({
    ref: UserEntity
  })
  public userId: Ref<UserEntity>;

  @prop()
  public commentsCount: number;

  @prop()
  public coords: [string, string];

  public id: string;

  public _id: Types.ObjectId;
}

export const OfferModel = getModelForClass(OfferEntity);
