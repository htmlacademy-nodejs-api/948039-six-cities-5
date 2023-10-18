import { City, Convenience, HouseTypeEnum , User } from './index.js';

export type MockOffer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  preview: string;
  images: string[];
  isPremium: boolean;
  houseType: HouseTypeEnum;
  room: number;
  guest: number;
  price: number;
  conveniences: Convenience[];
  user: Omit<User, 'password'>;
  commentsCount: number;
  coords: [string, string];
}
