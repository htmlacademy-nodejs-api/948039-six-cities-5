import mongoose from 'mongoose';

export const aggregateComments = [
  {
    $lookup: {
      from: 'comments',
      let: { offerId: '$_id'},
      pipeline: [
        { $match:
          { $expr:
            { $eq: [ '$offerId', '$$offerId' ] }
          }
        }
      ],
      as: 'comments'
    }
  },
  { $addFields:
    {
      commentsCount: { $size: '$comments' },
      rate: {$cond: [
        {
          $ne: [{
            $size: '$comments'
          },
          0
          ]
        },
        {$divide: [
          {$reduce: {
            input: '$comments',
            initialValue: 0,
            in: {$add: ['$$value', '$$this.rate'],}
          }},
          {$size: '$comments'}
        ]},
        0
      ]}
    }
  },
  { $unset: 'comments' },
];

export const aggregateDefaultFavorite = [
  { $addFields:
    { isFavorite: false }
  }
];

export const aggregateFavorite = (userId: string) => ([
  {
    $lookup: {
      from: 'favorites',
      let: { offerId: '$_id'},
      pipeline: [
        { $match:
          { $expr:
            { $and:
                [
                  { $eq: [ '$offerId', '$$offerId' ] },
                  { $eq: [ new mongoose.Types.ObjectId(userId), '$userId' ] }
                ]
            }
          }
        },
      ],
      as: 'favorites'
    }
  },
  { $addFields:
    {
      isFavorite: { $toBool: {$size: '$favorites'} },
    }
  },
  { $unset: 'favorites' },
]);

export const matchCity = (city: string) => ({
  $expr:
  { $and:
     [
       { $eq: [ '$city', city ] },
       { $eq: [ '$isPremium', true ] }
     ]
  }
});
