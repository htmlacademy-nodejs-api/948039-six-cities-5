import { IsString, IsInt, IsDateString, Max, Min, Length } from 'class-validator';
import { CreateCommentValidationMessage } from './create-comment.message.js';
export class CreateCommentDto {
  @IsString({message: CreateCommentValidationMessage.text.invalidFormat})
  @Length(5, 1024, {message: CreateCommentValidationMessage.text.length})
  public text: string;

  @IsInt({message: CreateCommentValidationMessage.rate.invalidFormat})
  @Min(1,{message: CreateCommentValidationMessage.rate.minValue})
  @Max(5,{message: CreateCommentValidationMessage.rate.maxValue})
  public rate: number;

  @IsDateString({}, {message: CreateCommentValidationMessage.postDate.invalidFormat})
  public postDate: Date;

  public offerId: string;

  public userId: string;
}
