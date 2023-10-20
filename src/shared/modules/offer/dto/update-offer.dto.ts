import { City, HouseTypeEnum ,Convenience} from '../../../types/index.js';
import { IsString, IsBoolean, IsEnum, IsArray, Length , IsDateString, IsIn, IsInt, Max, Min, ArrayNotEmpty , IsOptional } from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.message.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({message: CreateOfferValidationMessage.title.invalidFormat})
  @Length(10, 100, {message: CreateOfferValidationMessage.title.length})
  public title: string;

  @IsOptional()
  @IsString({message: CreateOfferValidationMessage.description.invalidFormat})
  @Length(20, 1024, {message: CreateOfferValidationMessage.description.length})
  public description: string;

  @IsOptional()
  @IsDateString({}, {message: CreateOfferValidationMessage.postDate.invalidFormat})
  public postDate: Date;

  @IsOptional()
  @IsIn(['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'], {message: CreateOfferValidationMessage.city.invalidValue})
  public city: City;

  @IsOptional()
  @IsString({message: CreateOfferValidationMessage.preview.invalidFormat})
  public preview: string;

  @IsOptional()
  @IsArray({message: CreateOfferValidationMessage.images.invalidFormat})
  @Length(6, 6, {message: CreateOfferValidationMessage.images.length})
  @IsString({each: true, message: CreateOfferValidationMessage.images.invalidValue})
  public images: string[];

  @IsOptional()
  @IsBoolean({message: CreateOfferValidationMessage.isPremium.invalidFormat})
  public isPremium: boolean;

  @IsOptional()
  @IsEnum(HouseTypeEnum, {message: CreateOfferValidationMessage.houseType.invalidFormat})
  public houseType: HouseTypeEnum;

  @IsOptional()
  @IsInt({message: CreateOfferValidationMessage.room.invalidFormat})
  @Min(1, {message: CreateOfferValidationMessage.room.minValue})
  @Max(8, {message: CreateOfferValidationMessage.room.maxValue})
  public room: number;

  @IsOptional()
  @IsInt({message: CreateOfferValidationMessage.guest.invalidFormat})
  @Min(1, {message: CreateOfferValidationMessage.guest.minValue})
  @Max(10, {message: CreateOfferValidationMessage.guest.maxValue})
  public guest: number;


  @IsOptional()
  @IsInt({message: CreateOfferValidationMessage.price.invalidFormat})
  @Min(100, {message: CreateOfferValidationMessage.price.minValue})
  @Max(100_000, {message: CreateOfferValidationMessage.price.maxValue})
  public price: number;

  @IsOptional()
  @IsArray({message: CreateOfferValidationMessage.conveniences.invalidFormat})
  @ArrayNotEmpty({message: CreateOfferValidationMessage.conveniences.length})
  @IsIn(['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'], {each: true, message: CreateOfferValidationMessage.conveniences.invalidValue})
  public conveniences: Convenience[];

  @IsOptional()
  @IsArray({message: CreateOfferValidationMessage.coords.invalidFormat})
  @Length(2,2, {message: CreateOfferValidationMessage.coords.length})
  @IsString({each: true, message: CreateOfferValidationMessage.coords.invalidValue})
  public coords: [string, string];
}
