/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserTypeEnum } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
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
}

export const UserModel = getModelForClass(UserEntity);
