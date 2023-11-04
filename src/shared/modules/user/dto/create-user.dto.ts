import { UserTypeEnum } from '../../../types/user-type.enum.js';
import { IsString, IsEmail, IsEnum, Length } from 'class-validator';
import { CreateUserValidationMessage } from './create-user.message.js';
import { MAX_NAME_LENGTH, MAX_PASSWORD_LENGTH, MIN_NAME_LENGTH, MIN_PASSWORD_LENGTH } from './constant.js';

export class CreateUserDto {
  @IsString({message: CreateUserValidationMessage.name.invalidFormat})
  @Length(MIN_NAME_LENGTH, MAX_NAME_LENGTH, {message: CreateUserValidationMessage.name.length})
  public name: string;

  @IsEmail({}, {message: CreateUserValidationMessage.email.invalidEmail})
  public email: string;

  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {message: CreateUserValidationMessage.password.length})
  public password: string;

  @IsEnum(UserTypeEnum, {message: CreateUserValidationMessage.type.invalitValue})
  public type: UserTypeEnum;
}
