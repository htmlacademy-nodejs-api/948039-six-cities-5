import { UserTypeEnum } from '../../../types/user-type.enum.js';
import { IsString, IsEmail, IsOptional, IsEnum, Length , Matches} from 'class-validator';
import { CreateUserValidationMessage } from './create-user.message.js';

export class CreateUserDto {
  @IsString({message: CreateUserValidationMessage.name.invalidFormat})
  @Length(1, 15, {message: CreateUserValidationMessage.name.length})
  public name: string;

  @IsEmail({}, {message: CreateUserValidationMessage.email.invalidEmail})
  public email: string;

  @IsOptional()
  @IsString({message: CreateUserValidationMessage.avatar.invalidFormat})
  @Matches(/.+\.(jpg|png)$/, {message: CreateUserValidationMessage.avatar.invalitType})
  public avatar?: string;

  @Length(6, 12, {message: CreateUserValidationMessage.password.length})
  public password: string;

  @IsEnum(UserTypeEnum, {message: CreateUserValidationMessage.type.invalitValue})
  public type: UserTypeEnum;
}
