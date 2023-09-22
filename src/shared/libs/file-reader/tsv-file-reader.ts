import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Offer } from '../../types/offer.type.js';
import { City } from '../../types/city.type.js';
import { HouseTypeEnum } from '../../types/house-type.enum.js';
import { Convenience } from '../../types/convenience.type.js';
import { UserTypeEnum } from '../../types/user-type.enum.js';

export class TSVFileReader implements FileReader {
  private rawData: string | undefined;

  constructor(private readonly path: string) {}

  public showFormatData(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, postDate, city, preview, images, isPremium, isFavorite, rate, houseType, room, guest, price, conveniences, name, email, avatar, password, type, commentsCount, coords]) => {
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
            password,
            type: type as UserTypeEnum,
          },
          commentsCount: Number.parseInt(commentsCount, 10),
          coords: [lat, lon],
        };
      });
  }

  read(): void {
    this.rawData = readFileSync(this.path, 'utf-8');
  }
}
