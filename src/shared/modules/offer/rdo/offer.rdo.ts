import { Expose, Transform } from 'class-transformer';

export class ShortOfferRdo {
  @Expose()
  @Transform((query) => query.obj['_id'])
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public postDate: Date;

  @Expose()
  public city: string;

  @Expose()
  public preview: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  @Transform(({value}) => value ? +value.toFixed(1) : 0)
  public rate: number;

  @Expose()
  public houseType: string;

  @Expose()
  public price: number;
}

export class OfferRdo {
  @Expose()
  @Transform((query) => query.obj[query.key])
  public _id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public postDate: Date;

  @Expose()
  public city: string;

  @Expose()
  public preview: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  @Transform(({value}) => value ? +value.toFixed(1) : 0)
  public rate: number;

  @Expose()
  public houseType: string;

  @Expose()
  public room: number;

  @Expose()
  public guest: number;

  @Expose()
  public price: number;

  @Expose()
  public conveniences: string[];

  @Expose()
  public commentsCount: number;

  @Expose()
  @Transform((query) => query.obj[query.key])
  public userId: string;

  @Expose()
  public coords: [string, string];
}
