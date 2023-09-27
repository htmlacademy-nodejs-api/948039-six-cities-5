import { City, Convenience, HouseTypeEnum, Offer, UserTypeEnum } from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [title, description, postDate, city, preview, images, isPremium, isFavorite, rate, houseType, room, guest, price, conveniences, name, email, avatar, type, commentsCount, coords] = offerData.replace('\n', '').split('\t');
  const [lat, lon] = coords.split(';');
  return {
    title,
    description,
    postDate: new Date(postDate),
    city: city as City,
    preview,
    images: images.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rate: Number.parseInt(rate, 10),
    houseType: houseType as HouseTypeEnum,
    room: Number.parseInt(room, 10),
    guest: Number.parseInt(guest, 10),
    price: Number.parseInt(price, 10),
    conveniences: conveniences.split(';') as Convenience[],
    user: {
      name,
      email,
      avatar,
      type: type as UserTypeEnum,
    },
    commentsCount: Number.parseInt(commentsCount, 10),
    coords: [lat, lon],
  };
}
