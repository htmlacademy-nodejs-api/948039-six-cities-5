import { City, HouseTypeEnum ,Convenience} from '../../../types/index.js';
import { IsString, IsBoolean, IsEnum, IsArray, Length , IsDateString, IsIn, IsInt, Max, Min, ArrayNotEmpty, ArrayMaxSize, ArrayMinSize} from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.message.js';

export class CreateOfferDto {
  @IsString({message: CreateOfferValidationMessage.title.invalidFormat})
  @Length(10, 100, {message: CreateOfferValidationMessage.title.length})
  public title: string;

  @IsString({message: CreateOfferValidationMessage.description.invalidFormat})
  @Length(20, 1024, {message: CreateOfferValidationMessage.description.length})
  public description: string;

  @IsDateString({}, {message: CreateOfferValidationMessage.postDate.invalidFormat})
  public postDate: Date;

  @IsIn(['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'], {message: CreateOfferValidationMessage.city.invalidValue})
  public city: City;

  @IsString({message: CreateOfferValidationMessage.preview.invalidFormat})
  public preview: string;

  @IsArray({message: CreateOfferValidationMessage.images.invalidFormat})
  @ArrayMaxSize(6, {message: CreateOfferValidationMessage.images.length})
  @ArrayMinSize(6, {message: CreateOfferValidationMessage.images.length})
  @IsString({each: true, message: CreateOfferValidationMessage.images.invalidValue})
  public images: string[];

  @IsBoolean({message: CreateOfferValidationMessage.isPremium.invalidFormat})
  public isPremium: boolean;

  @IsEnum(HouseTypeEnum, {message: CreateOfferValidationMessage.houseType.invalidFormat})
  public houseType: HouseTypeEnum;

  @IsInt({message: CreateOfferValidationMessage.room.invalidFormat})
  @Min(1, {message: CreateOfferValidationMessage.room.minValue})
  @Max(8, {message: CreateOfferValidationMessage.room.maxValue})
  public room: number;

  @IsInt({message: CreateOfferValidationMessage.guest.invalidFormat})
  @Min(1, {message: CreateOfferValidationMessage.guest.minValue})
  @Max(10, {message: CreateOfferValidationMessage.guest.maxValue})
  public guest: number;


  @IsInt({message: CreateOfferValidationMessage.price.invalidFormat})
  @Min(100, {message: CreateOfferValidationMessage.price.minValue})
  @Max(100_000, {message: CreateOfferValidationMessage.price.maxValue})
  public price: number;

  @IsArray({message: CreateOfferValidationMessage.conveniences.invalidFormat})
  @ArrayNotEmpty({message: CreateOfferValidationMessage.conveniences.length})
  @IsIn(['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'], {each: true, message: CreateOfferValidationMessage.conveniences.invalidValue})
  public conveniences: Convenience[];

  public userId: string;

  @IsArray({message: CreateOfferValidationMessage.coords.invalidFormat})
  @ArrayMaxSize(2, {message: CreateOfferValidationMessage.coords.length})
  @ArrayMinSize(2, {message: CreateOfferValidationMessage.coords.length})
  @IsString({each: true, message: CreateOfferValidationMessage.coords.invalidValue})
  public coords: [string, string];
}
