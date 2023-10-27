import { IsEmail, Length } from 'class-validator';
import { CreateUserValidationMessage } from './create-user.message.js';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from './constant.js';

export class LoginUserDto {
  @IsEmail({}, {message: CreateUserValidationMessage.email.invalidEmail})
  public email: string;

  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {message: CreateUserValidationMessage.password.length})
  public password: string;
}
