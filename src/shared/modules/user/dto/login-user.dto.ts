import { IsEmail, Length } from 'class-validator';
import { CreateUserValidationMessage } from './create-user.message.js';

export class LoginUserDto {
  @IsEmail({}, {message: CreateUserValidationMessage.email.invalidEmail})
  public email: string;

  @Length(6, 12, {message: CreateUserValidationMessage.password.length})
  public password: string;
}
