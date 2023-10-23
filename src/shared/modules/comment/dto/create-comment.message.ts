export const CreateCommentValidationMessage = {
  text: {
    invalidFormat: 'Text must be string',
    length: 'Text length must be into range 5 - 1024',
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  rate: {
    invalidFormat: 'rate must be an integer',
    minValue: 'Minimum rate is 1',
    maxValue: 'Maximum rate is 5',
  },
  offerId: {
    invalidId: 'offerId field must be a valid id',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
} as const;
