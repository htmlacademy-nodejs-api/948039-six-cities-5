/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserTypeEnum } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

const validateAvatar = (avatar: string | undefined) => {
  if (!avatar) {
    return true;
  }
  return avatar.endsWith('.jpg') || avatar.endsWith('.png');
};
const EMAIL_REGEXP = /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true, minlength: 1, maxlength: 15})
  public name: string;

  @prop({required: true, unique: true, match: EMAIL_REGEXP})
  public email: string;

  @prop({required: false, validate: validateAvatar, default: ''})
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
