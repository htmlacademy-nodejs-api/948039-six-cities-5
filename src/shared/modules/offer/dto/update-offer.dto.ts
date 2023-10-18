import { City, HouseTypeEnum ,Convenience} from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public preview?: string;
  public images?: string[];
  public isPremium?: boolean;
  public houseType?: HouseTypeEnum;
  public room?: number;
  public guest?: number;
  public price?: number;
  public conveniences?: Convenience[];
  coords?: [string, string];
}
