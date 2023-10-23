export const CreateOfferValidationMessage = {
  title: {
    invalidFormat: 'title must be string',
    length: 'title length must be into range 10 - 100',
  },
  description: {
    invalidFormat: 'description must be string',
    length: 'description length must be into range 20 - 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  city: {
    invalidValue: 'city must be one of City',
  },
  preview: {
    invalidFormat: 'preview must be string',
  },
  images: {
    invalidFormat: 'images must be array',
    length: 'images array length must be equil 6',
    invalidValue: 'images must be string',
  },
  isPremium: {
    invalidFormat: 'isPremium must be a boolean',
  },
  houseType: {
    invalidFormat: 'houseType must be a houseTypeEnum',
  },
  room: {
    invalidFormat: 'room must be an integer',
    minValue: 'Minimum room is 1',
    maxValue: 'Maximum room is 8',
  },
  guest: {
    invalidFormat: 'guest must be an integer',
    minValue: 'Minimum guest is 1',
    maxValue: 'Maximum guest is 10',
  },
  price: {
    invalidFormat: 'price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100 000',
  },
  conveniences: {
    invalidFormat: 'conveniences must be a array',
    length: 'images array length must be more or equil 1',
    invalidValue: 'convenience must be one of Convenience',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  coords: {
    invalidFormat: 'coords must be a array',
    length: 'coords array length must be equil 2',
    invalidValue: 'coords must be string',
  }
} as const;
