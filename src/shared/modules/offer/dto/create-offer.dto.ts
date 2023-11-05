import { City, HouseTypeEnum ,Convenience} from '../../../types/index.js';
import { IsString, IsBoolean, IsEnum, IsArray, Length , IsDateString, IsIn, IsInt, Max, Min, ArrayNotEmpty, ArrayMaxSize, ArrayMinSize} from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.message.js';
import { MIN_TITLE_LENGTH, MAX_TITLE_LENGTH, MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH, ALLOW_CITIES, MIN_IMAGES_COUNT, MAX_IMAGES_COUNT, MIN_ROOM_COUNT, MAX_ROOM_COUNT, MIN_GUEST_COUNT, MAX_GUEST_COUNT, MIN_PRICE, MAX_PRICE, ALLOW_CONVENIENVCES, MIN_COORDS_LENGTH, MAX_COORDS_LENGTH } from './constant.js';

export class CreateOfferDto {
  @IsString({message: CreateOfferValidationMessage.title.invalidFormat})
  @Length(MIN_TITLE_LENGTH, MAX_TITLE_LENGTH, {message: CreateOfferValidationMessage.title.length})
  public title: string;

  @IsString({message: CreateOfferValidationMessage.description.invalidFormat})
  @Length(MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH, {message: CreateOfferValidationMessage.description.length})
  public description: string;

  @IsDateString({}, {message: CreateOfferValidationMessage.postDate.invalidFormat})
  public postDate: Date;

  @IsIn(ALLOW_CITIES, {message: CreateOfferValidationMessage.city.invalidValue})
  public city: City;

  @IsString({message: CreateOfferValidationMessage.preview.invalidFormat})
  public preview: string;

  @IsArray({message: CreateOfferValidationMessage.images.invalidFormat})
  @ArrayMaxSize(MIN_IMAGES_COUNT, {message: CreateOfferValidationMessage.images.length})
  @ArrayMinSize(MAX_IMAGES_COUNT, {message: CreateOfferValidationMessage.images.length})
  @IsString({each: true, message: CreateOfferValidationMessage.images.invalidValue})
  public images: string[];

  @IsBoolean({message: CreateOfferValidationMessage.isPremium.invalidFormat})
  public isPremium: boolean;

  @IsEnum(HouseTypeEnum, {message: CreateOfferValidationMessage.houseType.invalidFormat})
  public houseType: HouseTypeEnum;

  @IsInt({message: CreateOfferValidationMessage.room.invalidFormat})
  @Min(MIN_ROOM_COUNT, {message: CreateOfferValidationMessage.room.minValue})
  @Max(MAX_ROOM_COUNT, {message: CreateOfferValidationMessage.room.maxValue})
  public room: number;

  @IsInt({message: CreateOfferValidationMessage.guest.invalidFormat})
  @Min(MIN_GUEST_COUNT, {message: CreateOfferValidationMessage.guest.minValue})
  @Max(MAX_GUEST_COUNT, {message: CreateOfferValidationMessage.guest.maxValue})
  public guest: number;

  @IsInt({message: CreateOfferValidationMessage.price.invalidFormat})
  @Min(MIN_PRICE, {message: CreateOfferValidationMessage.price.minValue})
  @Max(MAX_PRICE, {message: CreateOfferValidationMessage.price.maxValue})
  public price: number;

  @IsArray({message: CreateOfferValidationMessage.conveniences.invalidFormat})
  @ArrayNotEmpty({message: CreateOfferValidationMessage.conveniences.length})
  @IsIn(ALLOW_CONVENIENVCES, {each: true, message: CreateOfferValidationMessage.conveniences.invalidValue})
  public conveniences: Convenience[];

  public userId: string;

  @IsArray({message: CreateOfferValidationMessage.coords.invalidFormat})
  @ArrayMaxSize(MIN_COORDS_LENGTH, {message: CreateOfferValidationMessage.coords.length})
  @ArrayMinSize(MAX_COORDS_LENGTH, {message: CreateOfferValidationMessage.coords.length})
  @IsString({each: true, message: CreateOfferValidationMessage.coords.invalidValue})
  public coords: [string, string];
}
