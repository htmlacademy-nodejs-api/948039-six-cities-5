import { Comment, Offer, Type, User } from '../../types/types';
import {OfferRdo} from '../../../../src/shared/modules/offer/rdo/offer.rdo';
import {CommentRdo} from '../../../../src/shared/modules/comment/rdo/comment.rdo';
import { UserType } from '../../const';

export const adapterOffers = (offers: OfferRdo[]): Offer[] => offers.map((offer) => ({
  id: offer._id,
  price: offer.price,
  rating: offer.rate,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: {
    name: offer.city,
    location: {
      latitude: Number(offer.coords[0]),
      longitude: Number(offer.coords[1])
    }
  },
  location: {
    latitude: Number(offer.coords[0]),
    longitude: Number(offer.coords[1])
  },
  previewImage: offer.preview,
  type: offer.houseType as Type,
  bedrooms: offer.room,
  description: offer.description,
  goods: offer.conveniences,
  images: offer.images,
  maxAdults: offer.guest,
  host: {
    name: 'string',
    avatarUrl: 'string',
    type: 'UserType' as UserType,
    email: 'string',
  } as User,
}));

export const adapterOffer = (offer: OfferRdo): Offer => ({
  id: offer._id,
  price: offer.price,
  rating: offer.rate,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: {
    name: offer.city,
    location: {
      latitude: Number(offer.coords[0]),
      longitude: Number(offer.coords[1])
    }
  },
  location: {
    latitude: Number(offer.coords[0]),
    longitude: Number(offer.coords[1])
  },
  previewImage: offer.preview,
  type: offer.houseType as Type,
  bedrooms: offer.room,
  description: offer.description,
  goods: offer.conveniences,
  images: offer.images,
  maxAdults: offer.guest,
  host: {
    name: 'string',
    avatarUrl: 'string',
    type: 'UserType' as UserType,
    email: 'string',
  } as User,
});

export const adapterComments = (comments: CommentRdo[]): Comment[] => comments.map((comment) => ({
  id: comment.id,
  comment: comment.text,
  date: comment.createdAt,
  rating: comment.rate,
  user: {
    name: 'string',
    avatarUrl: 'string',
    type: 'UserType' as UserType,
    email: 'string',
  } as User,
}));
