import { City, HouseTypeEnum ,Convenience} from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public city: City;
  public preview: string;
  public images: string[];
  public isPremium: boolean;
  public houseType: HouseTypeEnum;
  public room: number;
  public guest: number;
  public price: number;
  public conveniences: Convenience[];
  public userId: string;
  public coords: [string, string];
}
