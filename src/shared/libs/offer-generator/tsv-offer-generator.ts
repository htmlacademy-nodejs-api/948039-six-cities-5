import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/common.js';
import { MockServerData } from '../../types/mock-server-data.type.js';
import { OfferGenerator } from './index.js';
import { FIRST_WEEK_DAY, LAST_WEEK_DAY, MAX_GUEST, MAX_LAT_VALUE, MAX_LON_VALUE, MAX_PRICE, MAX_RATE, MAX_ROOM, MIN_GUEST, MIN_LAT_VALUE, MIN_LON_VALUE, MIN_PRICE, MIN_RATE, MIN_ROOM } from './constants.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const postDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem(this.mockData.cities);
    const preview = getRandomItem(this.mockData.previews);
    const images = getRandomItems(this.mockData.images).join(';');
    const isPremium = Boolean(generateRandomValue(0, 1));
    const isFavorite = Boolean(generateRandomValue(0, 1));
    const rate = generateRandomValue(MIN_RATE, MAX_RATE, 1);
    const houseType = getRandomItem(this.mockData.houseTypes);
    const room = generateRandomValue(MIN_ROOM, MAX_ROOM);
    const guest = generateRandomValue(MIN_GUEST, MAX_GUEST);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const conveniences = getRandomItems(this.mockData.conveniences).join(';');
    const name = getRandomItem(this.mockData.names);
    const email = getRandomItem(this.mockData.emails);
    const avatar = getRandomItem(this.mockData.avatars);
    const type = getRandomItem(this.mockData.types);
    const commentsCount = generateRandomValue(0, 100);
    const lat = generateRandomValue(MIN_LAT_VALUE, MAX_LAT_VALUE, 5);
    const lon = generateRandomValue(MIN_LON_VALUE, MAX_LON_VALUE, 5);
    const coords = `${lat};${lon}`;
    return [title, description, postDate, city, preview, images, isPremium, isFavorite, rate, houseType, room, guest, price, conveniences, name, email,
      avatar, type, commentsCount,coords].join('\t');
  }
}
