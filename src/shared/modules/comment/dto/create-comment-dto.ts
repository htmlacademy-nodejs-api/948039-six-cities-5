import { IsString, IsInt, IsDateString, Max, Min, Length } from 'class-validator';
import { CreateCommentValidationMessage } from './create-comment.message.js';
import { MIN_TEXT_LENGTH, MAX_TEXT_LENGTH, MIN_RATE, MAX_RATE } from './constant.js';

export class CreateCommentDto {
  @IsString({message: CreateCommentValidationMessage.text.invalidFormat})
  @Length(MIN_TEXT_LENGTH, MAX_TEXT_LENGTH, {message: CreateCommentValidationMessage.text.length})
  public text: string;

  @IsInt({message: CreateCommentValidationMessage.rate.invalidFormat})
  @Min(MIN_RATE,{message: CreateCommentValidationMessage.rate.minValue})
  @Max(MAX_RATE,{message: CreateCommentValidationMessage.rate.maxValue})
  public rate: number;

  @IsDateString({}, {message: CreateCommentValidationMessage.postDate.invalidFormat})
  public postDate: Date;

  public offerId: string;

  public userId: string;
}
