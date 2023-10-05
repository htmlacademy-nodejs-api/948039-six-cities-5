import { City, Convenience, HouseTypeEnum, Offer } from '../types/index.js';

interface email { email: string }

type Assad = Omit<Offer, 'userId'> & email;

export function createOffer(offerData: string): Assad {
  const [title, description, postDate, city, preview, images, isPremium, isFavorite, rate, houseType, room, guest, price, conveniences, email, commentsCount, coords] = offerData.replace('\n', '').split('\t');
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
    email,
    commentsCount: Number.parseInt(commentsCount, 10),
    coords: [lat, lon],
  };
}
