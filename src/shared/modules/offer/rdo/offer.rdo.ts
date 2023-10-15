import { Expose, Transform } from 'class-transformer';

export class ShortOfferRdo {
  @Expose({name: '_id'})
  @Transform(({value}) => value.toString())
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
  public isFavorite: boolean = false;

  @Expose()
  @Transform(({ value }: {value: number}) => +value.toFixed(2))
  public rate: number = 0;

  @Expose()
  public houseType: string;

  @Expose()
  public price: number;

  @Expose()
  public commentsCount: number;
}

export class OfferRdo {
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
  public images: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean = false;

  @Expose()
  @Transform(({ value }: {value: number}) => value.toFixed(2), { toClassOnly: true })
  public rate: number = 0;

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
  public userId: string;

  @Expose()
  public commentsCount: number;

  @Expose()
  public coords: [string, string];
}
