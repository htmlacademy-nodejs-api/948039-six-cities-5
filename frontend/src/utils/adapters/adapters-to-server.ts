import { NewOffer } from '../../types/types';
import {CreateOfferDto} from '../../../../src/shared/modules/offer/dto/index';
import { City, Convenience, HouseTypeEnum } from '../../../../src/shared/types';

export const adapterPostOffers = (offer: NewOffer): CreateOfferDto => ({
  title: offer.title,
  description: offer.description,
  postDate: new Date(),
  city: offer.city.name as City,
  preview: offer.previewImage,
  images: offer.images,
  isPremium: offer.isPremium,
  houseType: offer.type as HouseTypeEnum,
  room: offer.bedrooms,
  guest: offer.maxAdults,
  price: offer.price,
  conveniences: offer.goods as Convenience[],
  coords: [offer.city.location.latitude.toString(), offer.city.location.longitude.toString()],
  userId: ''
});
