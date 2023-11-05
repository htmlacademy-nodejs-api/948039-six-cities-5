import { City, Convenience, HouseTypeEnum, MockOffer, UserTypeEnum } from '../types/index.js';
import { generateRandomValue } from './index.js';

const CITY_COORD_MAP = {
  Paris: [ 48.85661, 2.351499],
  Cologne: [ 50.938361, 6.959974],
  Brussels: [ 50.846557, 4.351697],
  Amsterdam: [ 52.370216, 4.895168],
  Hamburg: [ 53.550341, 10.000654],
  Dusseldorf: [ 51.225402, 6.776314],
};

export function createMockOffer(offerData: string): MockOffer {
  const [title, description, postDate, city, preview, images, isPremium, houseType, room, guest, price, conveniences, name, email, avatar, type] = offerData.replace('\n', '').split('\t');
  const latArr = CITY_COORD_MAP[city as City][0].toString().split('.');
  const randomValue = generateRandomValue(0, 9000);
  const newLat = Number(latArr[1]) + randomValue;
  const lat = `${latArr[0]}.${newLat}`;
  const lonArr = CITY_COORD_MAP[city as City][1].toString().split('.');
  const randomValue2 = generateRandomValue(0, 9000);
  const newLon = Number(lonArr[1]) + randomValue2;
  const lon = `${lonArr[0]}.${newLon}`;
  return {
    title,
    description,
    postDate: new Date(postDate),
    city: city as City,
    preview,
    images: images.split(';'),
    isPremium: isPremium === 'true',
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
    coords: [lat, lon],
  };
}
