import { IsMongoId } from 'class-validator';

export class CreateFavoriteDto {
  public userId: string;

  @IsMongoId()
  public offerId: string;
}
