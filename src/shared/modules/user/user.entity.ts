import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserTypeEnum } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps {
  @prop({required: true})
  public name: string;

  @prop({required: true, unique: true})
  public email: string;

  @prop({required: false, default: ''})
  public avatar?: string;

  @prop({required: true})
  private password?: string;

  @prop({required: true, enum: UserTypeEnum})
  public type: UserTypeEnum;

  public id: string;

  public _id: Types.ObjectId;

  constructor(user: User) {
    super();
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
    this.type = user.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
